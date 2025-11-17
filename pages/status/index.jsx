import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import useSWR from "swr";

/* eslint-disable no-unused-vars */

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
export default function StatusPage() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<h2>Carregando dados...</h2>}>
        <h1>Status</h1>
        <UpdatedAt />
        <TableDataBaseStatus />
      </Suspense>
    </ErrorBoundary>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Útima atualização: {updatedAtText}</div>;
}

function TableDataBaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading && !data) {
    return <h2>Carregando...</h2>;
  }

  return (
    <>
      <h2>Database</h2>
      <table border={1}>
        <thead>
          <tr style={{ border: "1px solid black" }}>
            <th>Versão</th>
            <th>Máximo de conexão</th>
            <th>Conexões abertas</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{data.dependencies.database.version}</td>
            <td>{data.dependencies.database.max_connections}</td>
            <td>{data.dependencies.database.opened_connections}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
