// debugMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const debugRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("=== DEBUG REQUEST ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  console.log("===================");

  // Capture la réponse originale
  const originalSend = res.send;
  res.send = function (body: any) {
    console.log("=== DEBUG RESPONSE ===");
    console.log("Status:", res.statusCode);
    console.log("Body:", body);
    console.log("====================");
    return originalSend.call(this, body);
  };

  next();
};
