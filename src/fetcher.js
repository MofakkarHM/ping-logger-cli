export async function pingDevice(url) {
  try {
    new URL(url);
  } catch (err) {
    return {
      host: url,
      statusCode: "INVALID_URL",
      ms: 0,
    };
  }

  const startTime = performance.now();

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const endTime = performance.now();

    return {
      host: url,
      statusCode: res.status,
      ms: Math.round(endTime - startTime),
    };
  } catch (err) {
    const endTime = performance.now();
    let status = "DOWN";

    if (err.name === "TimeoutError") {
      status = "TIMEOUT";
    }

    return {
      host: url,
      statusCode: status,
      ms: Math.round(endTime - startTime),
    };
  }
}
