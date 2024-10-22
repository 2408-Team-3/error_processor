import { handler } from "./index.js";

const mockEvent = {
  body: JSON.stringify({
    // Just "data"? Remove completely (why so nested)?
    error_data: {
      error: {
        name: 'MockError',
        message: 'A mock error occurred',
        stack_trace: 'Mock stack trace',
      },
      timestamp: new Date().toISOString(),
      type: 'unhandledError',
    },
  }),
};

const mockContext = {};

handler(mockEvent, mockContext)
  .then((response) => {
    console.log('Response:', response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });