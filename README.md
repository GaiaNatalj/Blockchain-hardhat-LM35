# Hardhat Project

-Per collegare la porta windows a wsl (su promt windows): usbipd attach --wsl --busid 1-2
(prima porta)

-Prima di compilare con localhost:ganache chainID(1337),yarn hardhat node chainID(31337)

-Per compilare: yarn hardhat compile
-Per compilare con hardhat: yarn hardhat run scripts/deploy.js --network hardhat
-Per compilare con sepolia: yarn hardhat run scripts/deploy.js --network sepolia
-Per compilare con localhost: yarn hardhat run scripts/deploy.js --network localhost
-Per eseguire il task: yarn hardhat block-number --network sepolia

-Per il test: yarn hardhat test
-Per il test specifico di una funzione: yarn hardhat test --grep "parole in descrizione"
-Per capire quante parti del codice sono testate: yarn hardhat coverage

E' possibile sostituire i valori del file .env per testare il progetto.
