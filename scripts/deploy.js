const fs = require("fs-extra");
const { ethers, run, network } = require("hardhat");
require("dotenv").config();
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

async function main() {
  //Factory del contratto
  const contractFactory = await ethers.getContractFactory("TemperaturaStorage");
  console.log("Distribuzione del contratto...");
  // Deploy del contratto
  const contract = await contractFactory.deploy();
  await contract.deploymentTransaction();
  console.log(`Contratto distribuito all'indirizzo: ${contract.target}`);

  // Verifica del contratto su Etherscan
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await contract.deploymentTransaction().wait(6);
    await verify(contract.target, []);
  }
  try {
    const temperatura = await leggiTemperatura();
    console.log("Temperatura letta:", temperatura);
    const oraCorrente = date();
    console.log(oraCorrente);
    let t = await contract.retrieve(oraCorrente);
    console.log("Aggiornamento della temperatura...");

    // Creazione della transazione
    const transaction = await contract.store(oraCorrente, temperatura);
    await transaction.wait();
    console.log("Transazione avvenuta con successo!");
    const temperatura1 = await contract.retrieve(oraCorrente);
    console.log("Temperatura recuperata:", temperatura1);
  } catch (error) {
    console.error("Errore durante la lettura della temperatura:", error);
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifica del contratto...");
  try {
    // Esegue la verifica del contratto utilizzando il plugin hardhat-etherscan
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contratto già verificato!");
    } else {
      console.log(e);
    }
  }
};

const date = () => {
  var dataOdierna = new Date();
  var ora = dataOdierna.getHours();
  var minuti = dataOdierna.getMinutes();
  var secondi = dataOdierna.getSeconds();
  //stringa con l'ora nel formato "HH:mm:ss"
  var oraCorrente =
    ora +
    ":" +
    (minuti < 10 ? "0" : "") +
    minuti +
    ":" +
    (secondi < 10 ? "0" : "") +
    secondi;
  return oraCorrente;
};

const leggiTemperatura = () => {
  const port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  return new Promise((resolve, reject) => {
    // Callback per l'evento "open" che viene chiamato quando la porta seriale è aperta con successo
    port.on("open", () => {
      console.log("Connessione seriale aperta");
    });

    // Callback per l'evento "data" che viene chiamato quando dati vengono ricevuti dalla porta seriale
    parser.on("data", (data) => {
      console.log("Dato ricevuto da Arduino:", data);
      port.close(); // Chiudi la porta seriale dopo aver ricevuto i dati
      resolve(data); // Risolvi la Promise con il valore della temperatura
    });

    // Callback per l'evento "error" che viene chiamato quando si verifica un errore sulla porta seriale
    port.on("error", (err) => {
      reject(err); // Se si verifica un errore, rifiuta la Promise
    });
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
