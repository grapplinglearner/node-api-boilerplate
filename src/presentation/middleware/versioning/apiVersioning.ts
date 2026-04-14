import { Request, Response, NextFunction } from 'express';

export interface VersionedRequest extends Request {
  apiVersion?: string;
}

export const apiVersioning = (req: VersionedRequest, res: Response, next: NextFunction): void => {
  const version = (req.headers['accept-version'] ||
                  req.headers['api-version'] ||
                  req.query.version ||
                  'v1') as string;

  const urlVersionMatch = req.path.match(/^\/api\/(v\d+)\//);
  if (urlVersionMatch) {
    req.apiVersion = urlVersionMatch[1];
  } else {
    req.apiVersion = Array.isArray(version) ? version[0] : version;
  }

  res.setHeader('API-Version', req.apiVersion || 'v1');

  next();
};

export const requireVersion = (minVersion: string) => {
  return (req: VersionedRequest, res: Response, next: NextFunction): void => {
    const currentVersion = req.apiVersion || 'v1';

    if (compareVersions(currentVersion, minVersion) < 0) {
      res.status(400).json({
        error: `API version ${currentVersion} is not supported. Minimum required version is ${minVersion}`,
      });
      return;
    }

    next();
  };
};

function compareVersions(version1: string, version2: string): number {
  const v1 = version1.replace('v', '').split('.').map(Number);
  const v2 = version2.replace('v', '').split('.').map(Number);

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}