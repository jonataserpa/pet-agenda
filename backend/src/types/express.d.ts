import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface IRouterMethods {
    // Sobrecargas para rotas simples com handlers diretos
    get(path: string, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    post(path: string, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    put(path: string, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    delete(path: string, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    
    // Sobrecargas para arrow functions que chamam controllers
    get(path: string, handler: (req: Request, res: Response) => any): this;
    post(path: string, handler: (req: Request, res: Response) => any): this;
    put(path: string, handler: (req: Request, res: Response) => any): this;
    delete(path: string, handler: (req: Request, res: Response) => any): this;
    
    // Sobrecargas para rotas com um middleware e handler
    get(path: string, middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<any>, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    post(path: string, middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<any>, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    put(path: string, middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<any>, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    delete(path: string, middleware: (req: Request, res: Response, next: NextFunction) => void | Promise<any>, handler: (req: Request, res: Response) => void | Promise<any> | Response): this;
    
    // Sobrecargas gerais para múltiplos middlewares/handlers
    get(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    post(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    put(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
    delete(path: string, ...handlers: Array<(req: Request, res: Response, next?: NextFunction) => any>): this;
  }
} 