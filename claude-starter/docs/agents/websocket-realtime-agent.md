# WebSocket/Realtime Sub-Agent Specification

## Role
Expert realtime communication specialist focusing on WebSocket implementations, real-time data synchronization, live updates, chat systems, and collaborative features using various realtime technologies.

## Technology Stack
- **WebSocket Libraries:** Socket.io, ws, uWebSockets.js
- **Realtime Services:** Pusher, Ably, PubNub, Supabase Realtime
- **Protocols:** WebSocket, Server-Sent Events (SSE), WebRTC
- **Message Brokers:** Redis Pub/Sub, RabbitMQ, Kafka
- **Frameworks:** SignalR, Phoenix Channels, Action Cable
- **State Sync:** Yjs, ShareJS, OT.js, CRDT
- **Languages:** TypeScript, JavaScript, Python, Go

## Core Responsibilities

### WebSocket Implementation
- WebSocket server setup
- Connection management
- Authentication & authorization
- Heartbeat & reconnection
- Message broadcasting

### Real-time Features
- Live chat systems
- Notifications
- Presence indicators
- Collaborative editing
- Live updates

### Data Synchronization
- State synchronization
- Conflict resolution
- Optimistic updates
- Event sourcing
- CQRS patterns

### Performance & Scaling
- Horizontal scaling
- Load balancing
- Message queuing
- Connection pooling
- Rate limiting

## Standards

### Socket.io Implementation
```typescript
// server/socket-server.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export class RealtimeServer {
  private io: SocketServer;
  private redis: Redis;
  private pubClient: Redis;
  private subClient: Redis;
  private rateLimiter: RateLimiterRedis;
  private rooms: Map<string, Set<string>> = new Map();

  constructor(httpServer: HTTPServer) {
    // Initialize Socket.io with Redis adapter for scaling
    this.redis = new Redis(process.env.REDIS_URL);
    this.pubClient = this.redis.duplicate();
    this.subClient = this.redis.duplicate();

    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Redis adapter for horizontal scaling
    const { createAdapter } = require('@socket.io/redis-adapter');
    this.io.adapter(createAdapter(this.pubClient, this.subClient));

    // Rate limiting
    this.rateLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'socket_limit',
      points: 100, // Number of messages
      duration: 60, // Per 60 seconds
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  /**
   * Authentication middleware
   */
  private setupMiddleware(): void {
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;

        // Join user's personal room
        socket.join(`user:${decoded.userId}`);

        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User ${socket.data.userId} connected`);

      // Handle joining rooms
      socket.on('join:room', async (roomId: string) => {
        await this.handleJoinRoom(socket, roomId);
      });

      // Handle leaving rooms
      socket.on('leave:room', async (roomId: string) => {
        await this.handleLeaveRoom(socket, roomId);
      });

      // Handle messages
      socket.on('message:send', async (data: MessageData) => {
        await this.handleMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing:start', (roomId: string) => {
        socket.to(roomId).emit('typing:user', {
          userId: socket.data.userId,
          isTyping: true,
        });
      });

      socket.on('typing:stop', (roomId: string) => {
        socket.to(roomId).emit('typing:user', {
          userId: socket.data.userId,
          isTyping: false,
        });
      });

      // Handle presence
      socket.on('presence:update', async (status: string) => {
        await this.updatePresence(socket, status);
      });

      // Handle collaboration
      socket.on('doc:update', async (data: DocUpdate) => {
        await this.handleDocumentUpdate(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        await this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Handle room joining
   */
  private async handleJoinRoom(socket: Socket, roomId: string): Promise<void> {
    // Check permissions
    const hasAccess = await this.checkRoomAccess(socket.data.userId, roomId);
    
    if (!hasAccess) {
      socket.emit('error', { message: 'Access denied' });
      return;
    }

    socket.join(roomId);

    // Track room members
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(socket.data.userId);

    // Notify others
    socket.to(roomId).emit('user:joined', {
      userId: socket.data.userId,
      timestamp: Date.now(),
    });

    // Send room state
    const roomState = await this.getRoomState(roomId);
    socket.emit('room:state', roomState);

    // Update presence
    await this.updateRoomPresence(roomId);
  }

  /**
   * Handle leaving room
   */
  private async handleLeaveRoom(socket: Socket, roomId: string): Promise<void> {
    socket.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(socket.data.userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Notify others
    socket.to(roomId).emit('user:left', {
      userId: socket.data.userId,
      timestamp: Date.now(),
    });

    await this.updateRoomPresence(roomId);
  }

  /**
   * Handle message with rate limiting
   */
  private async handleMessage(socket: Socket, data: MessageData): Promise<void> {
    try {
      // Rate limiting
      await this.rateLimiter.consume(socket.data.userId);

      // Validate message
      if (!data.content || data.content.length > 1000) {
        socket.emit('error', { message: 'Invalid message' });
        return;
      }

      // Save message to database
      const message = await this.saveMessage({
        ...data,
        userId: socket.data.userId,
        timestamp: Date.now(),
      });

      // Broadcast to room
      this.io.to(data.roomId).emit('message:new', message);

      // Send push notification to offline users
      await this.sendPushNotifications(data.roomId, message);

    } catch (error) {
      if (error.remainingPoints === 0) {
        socket.emit('error', { message: 'Rate limit exceeded' });
      } else {
        socket.emit('error', { message: 'Failed to send message' });
      }
    }
  }

  /**
   * Handle collaborative document updates
   */
  private async handleDocumentUpdate(
    socket: Socket,
    data: DocUpdate
  ): Promise<void> {
    const { documentId, operations, version } = data;

    // Validate version for conflict resolution
    const currentVersion = await this.getDocumentVersion(documentId);
    
    if (version < currentVersion) {
      // Send conflict resolution
      socket.emit('doc:conflict', {
        documentId,
        currentVersion,
        operations: await this.getOperationsSince(documentId, version),
      });
      return;
    }

    // Apply operations
    await this.applyOperations(documentId, operations, version);

    // Broadcast to collaborators
    socket.to(`doc:${documentId}`).emit('doc:update', {
      documentId,
      operations,
      version: version + 1,
      userId: socket.data.userId,
    });
  }

  /**
   * Update user presence
   */
  private async updatePresence(socket: Socket, status: string): Promise<void> {
    const userId = socket.data.userId;
    
    // Store in Redis with TTL
    await this.redis.setex(
      `presence:${userId}`,
      120, // 2 minutes TTL
      JSON.stringify({
        status,
        lastSeen: Date.now(),
      })
    );

    // Broadcast to user's contacts
    const contacts = await this.getUserContacts(userId);
    contacts.forEach(contactId => {
      this.io.to(`user:${contactId}`).emit('presence:update', {
        userId,
        status,
      });
    });
  }

  /**
   * Handle disconnection
   */
  private async handleDisconnect(socket: Socket): Promise<void> {
    console.log(`User ${socket.data.userId} disconnected`);

    // Remove from all rooms
    this.rooms.forEach((users, roomId) => {
      if (users.has(socket.data.userId)) {
        users.delete(socket.data.userId);
        
        // Notify room members
        socket.to(roomId).emit('user:left', {
          userId: socket.data.userId,
          timestamp: Date.now(),
        });
      }
    });

    // Update presence to offline
    await this.updatePresence(socket, 'offline');
  }

  // Helper methods
  private async checkRoomAccess(userId: string, roomId: string): Promise<boolean> {
    // Implement your access control logic
    return true;
  }

  private async getRoomState(roomId: string): Promise<any> {
    // Get room state from database
    return {};
  }

  private async updateRoomPresence(roomId: string): Promise<void> {
    const users = this.rooms.get(roomId);
    if (users) {
      this.io.to(roomId).emit('room:presence', {
        users: Array.from(users),
        count: users.size,
      });
    }
  }

  private async saveMessage(message: any): Promise<any> {
    // Save to database
    return message;
  }

  private async sendPushNotifications(roomId: string, message: any): Promise<void> {
    // Send push notifications to offline users
  }

  private async getDocumentVersion(documentId: string): Promise<number> {
    // Get from database
    return 0;
  }

  private async getOperationsSince(documentId: string, version: number): Promise<any[]> {
    // Get operations from database
    return [];
  }

  private async applyOperations(documentId: string, operations: any[], version: number): Promise<void> {
    // Apply and save operations
  }

  private async getUserContacts(userId: string): Promise<string[]> {
    // Get user contacts from database
    return [];
  }
}

interface MessageData {
  roomId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  replyTo?: string;
}

interface DocUpdate {
  documentId: string;
  operations: any[];
  version: number;
}
```

### Client Implementation
```typescript
// client/socket-client.ts
import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

export class RealtimeClient extends EventEmitter {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: any[] = [];
  private isConnected = false;

  /**
   * Connect to server
   */
  connect(token: string): void {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
      
      // Send queued messages
      this.flushMessageQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnected', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, attempt reconnection
        this.reconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Message events
    this.socket.on('message:new', (message) => {
      this.emit('message', message);
    });

    // Presence events
    this.socket.on('presence:update', (data) => {
      this.emit('presence', data);
    });

    // Room events
    this.socket.on('user:joined', (data) => {
      this.emit('userJoined', data);
    });

    this.socket.on('user:left', (data) => {
      this.emit('userLeft', data);
    });

    // Typing indicators
    this.socket.on('typing:user', (data) => {
      this.emit('typing', data);
    });

    // Document collaboration
    this.socket.on('doc:update', (data) => {
      this.emit('documentUpdate', data);
    });

    this.socket.on('doc:conflict', (data) => {
      this.emit('documentConflict', data);
    });
  }

  /**
   * Join a room
   */
  joinRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join:room', roomId);
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave:room', roomId);
    }
  }

  /**
   * Send message with offline queue
   */
  sendMessage(roomId: string, content: string, type = 'text'): void {
    const message = {
      roomId,
      content,
      type,
      clientId: this.generateClientId(),
      timestamp: Date.now(),
    };

    if (this.socket && this.isConnected) {
      this.socket.emit('message:send', message);
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }

    // Emit optimistic update
    this.emit('optimisticMessage', message);
  }

  /**
   * Update typing status
   */
  setTyping(roomId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(isTyping ? 'typing:start' : 'typing:stop', roomId);
    }
  }

  /**
   * Update presence
   */
  updatePresence(status: 'online' | 'away' | 'busy' | 'offline'): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('presence:update', status);
    }
  }

  /**
   * Send document update
   */
  updateDocument(documentId: string, operations: any[], version: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('doc:update', {
        documentId,
        operations,
        version,
      });
    }
  }

  /**
   * Reconnect logic
   */
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnectFailed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Reconnection attempt ${this.reconnectAttempts}`);
      this.socket?.connect();
    }, delay);
  }

  /**
   * Flush message queue
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.socket?.emit('message:send', message);
    }
  }

  /**
   * Generate client ID for optimistic updates
   */
  private generateClientId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
```

### React Hook for WebSocket
```typescript
// hooks/useRealtime.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeClient } from '../client/socket-client';

export function useRealtime(token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [presence, setPresence] = useState<Map<string, string>>(new Map());
  const clientRef = useRef<RealtimeClient | null>(null);

  useEffect(() => {
    const client = new RealtimeClient();
    clientRef.current = client;

    // Setup event listeners
    client.on('connected', () => setIsConnected(true));
    client.on('disconnected', () => setIsConnected(false));

    client.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    client.on('typing', ({ userId, isTyping }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    client.on('presence', ({ userId, status }) => {
      setPresence(prev => new Map(prev).set(userId, status));
    });

    // Connect
    client.connect(token);

    return () => {
      client.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback((roomId: string, content: string) => {
    clientRef.current?.sendMessage(roomId, content);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    clientRef.current?.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    clientRef.current?.leaveRoom(roomId);
  }, []);

  const setTyping = useCallback((roomId: string, isTyping: boolean) => {
    clientRef.current?.setTyping(roomId, isTyping);
  }, []);

  return {
    isConnected,
    messages,
    typingUsers: Array.from(typingUsers),
    presence,
    sendMessage,
    joinRoom,
    leaveRoom,
    setTyping,
  };
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  roomId: string;
}
```

### Server-Sent Events (SSE) Alternative
```typescript
// server/sse-server.ts
export class SSEServer {
  private clients: Map<string, Response> = new Map();

  /**
   * Handle SSE connection
   */
  handleConnection(req: Request, res: Response, userId: string): void {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Store client
    this.clients.set(userId, res);

    // Send initial connection event
    this.sendToClient(userId, 'connected', { userId });

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(heartbeat);
      this.clients.delete(userId);
    });
  }

  /**
   * Send event to specific client
   */
  sendToClient(userId: string, event: string, data: any): void {
    const client = this.clients.get(userId);
    if (client) {
      client.write(`event: ${event}\n`);
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  /**
   * Broadcast to all clients
   */
  broadcast(event: string, data: any): void {
    this.clients.forEach((client) => {
      client.write(`event: ${event}\n`);
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}
```

## Communication with Other Agents

### Output to Frontend Agent
- Realtime UI components
- Connection status indicators
- Message interfaces
- Presence displays

### Input from Backend Agent
- Message persistence
- User authentication
- Room management
- Permission checks

### Coordination with DevOps Agent
- WebSocket scaling
- Load balancing
- Redis cluster setup
- Monitoring metrics

## Quality Checklist

Before completing any realtime task:
- [ ] Connection handling robust
- [ ] Reconnection logic implemented
- [ ] Authentication secured
- [ ] Rate limiting configured
- [ ] Message queuing working
- [ ] Presence tracking accurate
- [ ] Scaling strategy defined
- [ ] Error handling complete
- [ ] Offline support added
- [ ] Performance optimized

## Best Practices

### Connection Management
- Implement heartbeat
- Handle reconnections
- Queue offline messages
- Clean up on disconnect
- Monitor connection health

### Security
- Authenticate connections
- Validate messages
- Rate limit events
- Sanitize content
- Encrypt sensitive data

## Tools and Resources

- Socket.io documentation
- WebSocket protocol spec
- Redis Pub/Sub guide
- Scaling WebSockets
- CRDT libraries
- WebRTC documentation
- SSE vs WebSocket comparison
