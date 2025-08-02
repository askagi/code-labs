import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100, // valor maximo de repeticoes, valor padrao:10
      maxTimeout: 1000, // valor maximo de espera
      onRetry: (error, attempt) => {
        console.log(
          `Attemp ${attempt} - Failed to fetch status page: ${error.message}`,
        );
      },
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error(`HTTP error ${response.status}`);
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};
export default orchestrator;
