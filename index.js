import axios from 'axios';
// let dbConnection = createNewDbConnection();

export const handler = async (event, context) => {
  const body = JSON.parse(event.body || '{}');

  // Request Payload Format:
  //   error_data = {
  //     'error': raw_error_data,
  //     'timestamp':  request.timestamp.isoformat(),
  //     'type': error_type
  //     'reason': reason, // ? different lambdas for errors, requests, promises?
  // }

  // Raw Error Data Format:
  //   raw_error_data = {
  //     'name': type(e).__name__,
  //     'message': str(e),
  //     'stack_trace': traceback.format_exc(),
  //     'status_code': status_code
  // }

  const error_data = body.error_data;

  // In the case statements, format for the database
  switch (error_data.type) {
    case 'unhandledError':

    case 'handledError':

    case 'unhandledRejectedPromise':

    case 'handledRejectedPromise':

  }

  // Webhook: post request to backend to inform of incoming data
  // axios.post()

  return {
    statusCode: 200,
    body: { message: 'error data received'}
  };
};