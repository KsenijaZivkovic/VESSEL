import { isNaN } from "lodash";

export const checkResponse = async (response) => {
  if (!response.ok) {
    const { status, statusText, url } = response;
    const { error } = response.json ? await response.json() : {};
    throw new Error(
      JSON.stringify({ status, statusText: error || statusText, url })
    );
  }
  return response.json();
};

export const notifyError = (err, history, url) => {
  try {
    const response = JSON.parse(err.message);
    if (typeof response === "object") {
      history.replace(history.location.pathname, response);
    }
  } catch (error) {
    history.replace(history.location.pathname, {
      status: 500,
      statusText: `Server not available: ${err.message}`,
      url,
    });
  }
};

export const shortenAddr = (addr) => {
  if (!addr) return addr;
  const firstChunk = addr.slice(0, 4);
  const secondChunk = addr.slice(addr.length - 4, addr.length);
  return `${firstChunk}...${secondChunk}`;
};

// rudimentary address check before actually querying with bad inputs
export const isAddr = (addr) => {
  // remove special chars
  addr = addr.replace(/[^a-z0-9]/gi, "");
  // remove 0x prefix if exists
  const noPrefix = addr.startsWith("0x") ? addr.replace("0x", "") : addr;
  // result should be 16 chars long
  return noPrefix.length === 16;
};

export const formatActionString = (str) => {
  const isFungibleTransfer = str.includes("FungibleToken.Receiver");
  let newStr = "";
  const words = str.split(" ");
  words.forEach((word, idx) => {
    const noLength = !word?.trim().length;
    //remove class names like Capability<&AnyResource{A.0x.FungibleToken.Receiver}>
    const isClass = word.startsWith("Capability<");
    if (noLength || isClass) {
      return;
    }
    const float = parseFloat(word);
    if (isNaN(float) || word.startsWith("0x")) {
      // add FLOW to token transfers
      if (isFungibleTransfer && word === "tokens") {
        newStr += "FLOW ";
      }
      newStr += word;
    } else {
      newStr += float;
    }
    // add space if not done
    if (idx < words.length - 1) {
      newStr += " ";
    }
  });

  // remove "from the treasury" as thats implied
  newStr = newStr.replace("from the treasury ", "");

  return newStr;
};

export const getProgressPercentageForSignersAmount = (signersAmount) => {
  return Math.min(60 + signersAmount * 10, 100);
};

export const getFlowscanUrlForTransaction = (hash) => {
  return `https://${
    process.env.REACT_APP_FLOW_ENV === "mainnet" ? "" : "testnet."
  }flowscan.org/transaction/${hash}`;
};
