
class CustomError {
    constructor(message) {
      this.message = message;
    }
  }


export const handleRequestError = (err) => {
    if (err instanceof TypeError) {
      return new CustomError("Browser error: please refresh");
    } else if (err instanceof AxiosError) {
      const responseErrMessage = err.response.data?.message;
      console.log(responseErrMessage);
      if (!responseErrMessage) {
        return new CustomError("Server error: retry again");
      } else {
        const responseErrStatus = err.response.status;
        const myMessage = statusErrMessage[String(responseErrStatus)];
        console.log(myMessage);
        if(!myMessage) {
          return new CustomError("Something went wrong! Re-try later.");
        }
  
        return new CustomError(myMessage);
      }
    } 
    return new CustomError("Something went wrong! Re-try later.");
  };