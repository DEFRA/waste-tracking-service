import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import multer from 'multer';
import { User } from '../../lib/user';
import {
  createBatch,
  getBatch,
  finalizeBatch,
  downloadCsv,
  getColumn,
  getRow,
  getSubmissions,
} from './uk-waste-movements-bulk-submission.backend';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../lib/errors';
import { isValid } from 'date-fns';

const upload = multer();

export default class UkwmBulkSubmissionPlugin {
  constructor(
    private server: Application,
    private prefix: string,
  ) {}

  async register(): Promise<void> {
    this.server.post(this.prefix, upload.any(), async (req, res) => {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }

      const inputs = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => ({
          type: file.mimetype,
          data: file.buffer,
        }),
      );

      const user = req.user as User;
      try {
        const batch = await createBatch(user.credentials.accountId, inputs);
        return res.status(201).json(batch);
      } catch (err) {
        if (err instanceof BadRequestError || err instanceof Error) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/:id`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getBatch({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetBulkSubmissionResponse);
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.post(`${this.prefix}/:id/finalize`, async (req, res) => {
      const user = req.user as User;
      try {
        return res.status(201).json(
          (await finalizeBatch({
            id: req.params.id,
            accountId: user.credentials.accountId,
          })) as undefined,
        );
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/:id/download`, async (req, res) => {
      try {
        const csvData = await downloadCsv();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=waste-tracking.csv',
        );
        return res.send(csvData);
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/:batchId/rows/:rowId`, async (req, res) => {
      try {
        const row = await getRow({
          batchId: req.params.batchId,
          rowId: req.params.rowId,
        });
        return res.send(row);
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(
      `${this.prefix}/:batchId/columns/:columnRef`,
      async (req, res) => {
        try {
          const column = await getColumn({
            batchId: req.params.batchId,
            columnRef: req.params.columnRef,
          });
          return res.send(column);
        } catch (err) {
          if (err instanceof NotFoundError) {
            return err;
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.get(`${this.prefix}/:batchId/submissions`, async (req, res) => {
      try {
        const page = Number(req.query.page);
        if (!page || page <= 0) {
          return res.status(400).jsonp(new BadRequestError('Invalid page'));
        }
        const dateArr = req.query.collectionDate
          ?.toString()
          ?.replace(/-/g, '/')
          .split('/');
        let collectionDate: Date | undefined;

        if (dateArr?.length === 3) {
          collectionDate = new Date(
            Number(dateArr[2]),
            Number(dateArr[1]) - 1,
            Number(dateArr[0]),
          );
          if (
            !isValid(collectionDate) ||
            collectionDate.getMonth() + 1 !== Number(dateArr[1])
          ) {
            return res
              .status(400)
              .jsonp(new BadRequestError('Invalid collection date'));
          }
        }

        const pageSize = Number(req.query.pageSize) || 15;

        const value = await getSubmissions(
          page,
          pageSize,
          collectionDate,
          req.query.ewcCode?.toString(),
          req.query.producerName?.toString(),
          req.query.wasteMovementId?.toString(),
        );

        return res.json(value as dto.UkwmGetDraftsResult);
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
