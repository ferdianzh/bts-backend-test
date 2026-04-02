import { HttpException } from '@nestjs/common';

interface ISqlError {
  code: string;
  errno: number;
  sqlState: string;
  sqlMessage: string;
  sql: string;
}
export interface ICallbackFunction {
  (param: string): Promise<any>;
}

export class CustomSqlException extends HttpException {
  constructor(error: ISqlError) {
    const handler = (error: ISqlError): { status: number; message: string } => {
      switch (error.code) {
        case 'ER_DUP_ENTRY': {
          const match = error.sqlMessage.match(/unique_(.*[^'])/);
          const column = match
            ? match
                .pop()
                ?.split(/_per_.*/)
                ?.shift()
            : 'column';

          return { status: 409, message: `${column} already exist` };
        }

        case 'ER_NO_REFERENCED_ROW_2': {
          return {
            status: 400,
            message: `${
              error.sqlMessage.split('KEY (`').pop()?.split('`)')[0] ?? 'column'
            } not found`,
          };
        }

        case 'ER_ROW_IS_REFERENCED_2': {
          const matchTable = error.sqlMessage.match(
            /`([^`]+)REFERENCES `([^`]+)`/,
          );
          const table = matchTable ? matchTable[2] : null;
          const matchForeign = error.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
          const foreign = matchForeign ? matchForeign[2] : null;

          return {
            status: 409,
            message: `cannot delete selected ${table}${
              foreign ? `, referenced in ${foreign}` : ''
            }`,
          };
        }

        default: {
          throw error;
        }
      }
    };

    const { status, message } = handler(error);
    super(message, status);
  }
}
