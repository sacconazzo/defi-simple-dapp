// Utility per ottenere dati reali dal contratto senza web3 né API key
// Funziona su tutte le chain definite in chains.js

/**
 * Ottiene il saldo (TVL) di un contratto usando l'RPC pubblico della chain
 * @param {string} rpcUrl - L'RPC pubblico della chain
 * @param {string} contractAddress - L'address del contratto
 * @returns {Promise<string>} - Il saldo in wei (stringa)
 */
export async function getContractBalance(rpcUrl, contractAddress) {
  const data = {
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [contractAddress, 'latest'],
    id: 1,
  };
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.result; // hex string, es: '0x123...'
}

/**
 * Ottiene il numero di utenti unici che hanno interagito con il contratto
 * Richiede una API key dell'explorer (Etherscan, BscScan, ecc.)
 * @param {string} explorerApiUrl - URL base dell'API explorer (es: https://api.etherscan.io)
 * @param {string} contractAddress - Address del contratto
 * @param {string} apiKey - API key dell'explorer
 * @returns {Promise<number|null>} - Numero utenti unici, o null se errore/manca apiKey
 */
export async function getUniqueUsers(explorerApiUrl, contractAddress, apiKey) {
  if (!apiKey) return null;
  const url = `${explorerApiUrl}/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== '1' || !json.result) return null;
    const unique = new Set(json.result.map(tx => tx.from.toLowerCase()));
    return unique.size;
  } catch {
    return null;
  }
}

/**
 * Calcola le rewards totali distribuite dal contratto (approssimato: somma delle uscite)
 * Richiede una API key dell'explorer (Etherscan, BscScan, ecc.)
 * @param {string} explorerApiUrl - URL base dell'API explorer
 * @param {string} contractAddress - Address del contratto
 * @param {string} apiKey - API key dell'explorer
 * @returns {Promise<number|null>} - Rewards totali (in Ether), o null se errore/manca apiKey
 */
export async function getTotalRewards(explorerApiUrl, contractAddress, apiKey) {
  if (!apiKey) return null;
  const url = `${explorerApiUrl}/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== '1' || !json.result) return null;
    // Rewards: somma delle uscite (tx in cui il contratto è il mittente)
    const outgoing = json.result.filter(
      tx => tx.from.toLowerCase() === contractAddress.toLowerCase()
    );
    const total = outgoing.reduce(
      (acc, tx) => acc + parseFloat(tx.value) / 1e18,
      0
    );
    return total;
  } catch {
    return null;
  }
}

// Placeholder: Ottenere utenti unici e rewards richiede API explorer (Etherscan, BscScan, ecc.)
// Esempio di funzione (da abilitare solo se hai una API key):
/*
export async function getUniqueUsersAndRewards(explorerApiUrl, contractAddress, apiKey) {
  // Esempio per Etherscan:
  // const url = `${explorerApiUrl}/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`;
  // const res = await fetch(url);
  // const json = await res.json();
  // ...
  // Calcola utenti unici e rewards dalle transazioni
}
*/
