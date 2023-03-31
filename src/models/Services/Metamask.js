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

    this.ethereum = null;

    this.accounts = [];

    this.web3 = new Web3(Web3.givenProvider);

    this.chainId = window.ethereum && +window.ethereum.networkVersion;

    this.network = this.networks[this.chainId];
  }

  async updateChainId() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    this.chainId = parseInt(chainId, 16);
  }

  setCustomListeners() {
    this.ethereum.on('accountsChanged', function (accounts) {
      this.accounts = accounts;
    });

    this.ethereum.on('chainChanged', async () => {
      await this.updateChainId();
      this.network = this.networks[this.chainId];
    });

    this.ethereum.on('close', function () {
      this.accounts = [];
    });
  }

  async connect() {
    const { ethereum = null } = window;

    if (!ethereum) {
      return notify({
        type: 'warning',
        text: 'Metamask extension not found',
      });
    }

    this.ethereum = ethereum;

    this.setCustomListeners();

    const accounts = await this.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts && accounts.length) {
      this.accounts = accounts;
      await this.setChainId();
      this.network = this.networks[this.chainId];
    }
  }

  async changeNetwork(network) {
    await this.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network || '0x1' }], // chainId must be in hexadecimal numbers
    });
  }

  async signMessage(message, signer) {
    const { ERROR } = this.ethereum._log.levels;
    this.ethereum._log.disableAll(ERROR); // disable

    try {
      return await this.ethereum.request({
        method: 'personal_sign',
        params: [signer, this.web3.utils.utf8ToHex(message)],
      });
    } catch (error) {
      console.warn('🔴 MetamaskConnector.error:', {
        code: error.code,
        message: error.message,
      });
    }
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
      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      if (memTxId) {
        store.dispatch('extensions/putMempoolChangeStatus', {
          hash: txHash,
          mempool_id: memTxId,
        });
      }

      return { 
        txHash 
      };
    } catch (err) {
      return { error: 'Metamask sign tx error' };
    }
  }

  disconnect() {
    this.accounts = [];
  }
}
