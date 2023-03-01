const Web3 = require('web3');
import notify from '@/plugins/notify';
import store from '@/store';

export default class MetamaskConnector {
  constructor() {
    this.networks = {
      1: 'eth',
      56: 'bsc',
      137: 'polygon',
      10: 'optimism',
      42161: 'arbitrum',
      9001: 'evmoseth',
      43114: 'avalanche',
    };
    this.accounts = [];
    this.web3 = new Web3(Web3.givenProvider);
    this.chainId = window.ethereum && +window.ethereum.networkVersion;
    this.network = this.networks[this.chainId];
  }

  /* get network() {
    return this.networks[this.chainId];
  } */

  async connect() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length) {
        this.accounts = accounts;
        this.chainId = parseInt(
          await window.ethereum.request({ method: 'eth_chainId' }),
          16
        );
        this.network = this.networks[this.chainId];

        window.ethereum.on('accountsChanged', (accounts) => {
          this.accounts = accounts;
        });

        window.ethereum.on('chainChanged', async () => {
          this.chainId = parseInt(
            await window.ethereum.request({ method: 'eth_chainId' }),
            16
          );
          this.network = this.networks[this.chainId];
        });

        window.ethereum.on('close', () => {
          this.accounts = [];
        });
      }
    } else {
      notify({
        type: 'warning',
        text: 'Metamask extension not found',
      });
    }
  }

  async changeNetwork(network) {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network || '0x1' }], // chainId must be in hexadecimal numbers
    });
  }

  async signMessage(message, signer) {
    return await window.ethereum.request({
      method: 'personal_sign',
      params: [signer, this.web3.utils.utf8ToHex(message)],
    });
  }

  async sendMetamaskTransaction(rawTx, memTxId) {
    const transaction = rawTx.transaction || rawTx;

    if (Array.isArray(transaction)) {
      const txs = transaction.map((tx) => {
        return {
          data: tx.data,
          from: tx.from,
          to: tx.to,
          nonce: `0x${tx.nonce.toString(16)}`,
          chainId: `0x${tx.chainId.toString(16)}`,
          gas: `0x${tx.gas.toString(16)}`,
          gasPrice: `0x${parseInt(tx.gasPrice).toString(16)}`,
          value: tx.value ? `0x${parseInt(tx.value).toString(16)}` : '',
        };
      });

      try {
        return await Promise.all(
          txs.map(async (tx) => {
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [tx],
            });
            if (txHash?.length > 0 && memTxId) {
              store.dispatch('extensions/putMempoolChangeStatus', {
                hash: txHash,
                mempool_id: memTxId,
              });
            }

            return txHash;
          })
        );
      } catch (err) {
        return { error: 'Metamask sign txs error' };
      }

      /* try {
        const txHash = await window.ethereum.request({ method: 'eth_sendTransaction', params: txs });

        return { txHash };
      } catch(err) {
        return { error: 'Metamask sign txs error' };
      } */
    }

    const tx = {
      data: transaction.data,
      from: transaction.from,
      to: transaction.to,
      nonce: `0x${transaction.nonce.toString(16)}`,
      chainId: `0x${transaction.chainId.toString(16)}`,
      gas: `0x${transaction.gas.toString(16)}`,
      gasPrice: `0x${parseInt(transaction.gasPrice).toString(16)}`,
      value: transaction.value
        ? `0x${parseInt(transaction.value).toString(16)}`
        : '',
    };

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      if (memTxId) {
        store.dispatch('extensions/putMempoolChangeStatus', {
          hash: txHash,
          mempool_id: memTxId,
        });
      }

      return { txHash };
    } catch (err) {
      return { error: 'Metamask sign tx error' };
    }
  }

  disconnect() {
    this.accounts = [];
  }
}
