const ENV = {
  APP_API_URL:
    window["APP_API_URL" as any] ?? `${process.env.REACT_APP_API_URL}`,
};

export default ENV;
