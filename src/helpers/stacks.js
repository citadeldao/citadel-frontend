export const getTimeForClaim = (nft, stakingInfo) => {
  if (!nft) return '';
  const blocksRemaining = nft.endUnlock - stakingInfo?.currentHeight;
  const totalMinutes = blocksRemaining * 10;

  const days = Math.abs(Math.floor(totalMinutes / 1440)); // 1440 минут в дне
  const hours = Math.abs(Math.floor((totalMinutes % 1440) / 60));
  const minutes = Math.abs(totalMinutes % 60);

  const readable = `${days}days, ${hours}hours, ${minutes}mins`;
  return `${readable}`;
};
