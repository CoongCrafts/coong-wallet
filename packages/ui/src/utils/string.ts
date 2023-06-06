export const shortenAddress = (address: string): string => {
  if (!address) {
    return '';
  }

  const length = address.length;
  if (length <= 15) {
    return address;
  }

  return `${address.substring(0, 6)}...${address.substring(length - 6, length)}`;
};

export const randomWalletInstanceId = (): string => {
  return `coong/instance-${Math.floor(Math.random() * 1_0000_000)}`;
};

export const trimOffUrlProtocol = (url: string): string => {
  return url.replace(/https?:\/\//, '');
};
