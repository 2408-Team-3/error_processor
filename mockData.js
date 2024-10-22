import { handler } from "./index.js";

const mockEvent = {
  body: JSON.stringify({
    data: {
      error: {
        name: 'MockError',
        message: 'A mock error occurred',
        stack_trace: 'Mock stack trace',
      },
      handled: false,
      timestamp: new Date().toISOString(),
      project_id: 123,
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