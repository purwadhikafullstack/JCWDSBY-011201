import express, { json, Express } from 'express';
import cors from 'cors';
import { join } from 'path';
import { NODE_ENV, PORT } from './config';
import router from './router';
import { DB } from './db';

/**
 * Serve "web" project build result (for production only)
 * @param {Express} app
 */
const serveWebProjectBuildResult = (app) => {
  if (NODE_ENV !== 'development') {
    const clientPath = '../../web/dist';
    app.use(express.static(join(__dirname, clientPath)));

    // Serve the HTML page
    app.get('*', (req, res) => {
      res.sendFile(join(__dirname, clientPath, 'index.html'));
    });
  }
};

/**
 * Global error handler
 * @param {Express} app
 */
const globalAPIErrorHandler = (app) => {
  // not found
  app.use((req, res, next) => {
    if (req.path.includes('/api/')) {
      res.status(404).send('Not found !');
    } else {
      next();
    }
  });

  // error
  app.use((err, req, res, next) => {
    if (req.path.includes('/api/')) {
      console.error('Error : ', err.stack || err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).send('File size exceeds the limit!');
      }
      // res.status(500).send('Error !'); //! Change response with template
      res.status(err.rc || 500).json({
        rc: err.rc || 500,
        success: false,
        message: err.message,
        result: null,
      });
    } else {
      next();
    }
  });
};

/**
 * Main function of API project
 */
const main = () => {
  DB.initialize();

  const app = express();
  app.use(cors());
  app.use(json());
  app.use('/api', router);
  app.use('/event', express.static(__dirname + '/assets/event')); //! To be discussed
  app.use('/category', express.static(__dirname + '/assets/category')); //! To be discussed
  app.use('/product', express.static(__dirname + '/assets/product')); //! To be discussed
  app.use('/avatar', express.static(__dirname + '/assets/avatar')); //! To be discussed

  globalAPIErrorHandler(app);
  serveWebProjectBuildResult(app);

  app.listen(PORT, (err) => {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    }
  });
};

main();
