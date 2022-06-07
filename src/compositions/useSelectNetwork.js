import { useStore } from 'vuex';
import { ledgerNets, trezorNets } from '@/config/availableNets';

export default function useSelectNetwork() {
  const store = useStore();
  const networksList = store.getters['networks/networksList'];
  const netByTitle = {};
  const networks = networksList.map((network, index) => {
    const title = `${network.name} (${network.code})`;
    netByTitle[title] = network.net;

    return {
      id: index,
      title,
      icon: network.net,
    };
  });

  const ledgerNetworks = networksList
    .filter((network) => ledgerNets.includes(network.net))
    .map((network, index) => {
      const title = `${network.name} (${network.code})`;
      netByTitle[title] = network.net;

      return {
        id: index,
        title,
        icon: network.net,
      };
    });

  const trezorNetworks = networksList
    .filter((network) => trezorNets.includes(network.net))
    .map((network, index) => {
      const title = `${network.name} (${network.code})`;
      netByTitle[title] = network.net;

      return {
        id: index,
        title,
        icon: network.net,
      };
    });

  return {
    networks,
    netByTitle,
    ledgerNetworks,
    trezorNetworks,
  };
}
