// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract TemperaturaStorage {

    // Mappa che associa timestamp a valori di temperatura
    mapping(string => string) public temperatureData;

    // Funzione per memorizzare un valore di temperatura
    function store(string memory timestamp, string memory temperatura) public {
        temperatureData[timestamp] = temperatura;
    }

    // Funzione per recuperare il valore di temperatura associato a un timestamp
    function retrieve(string memory timestamp) public view returns (string memory) {
        return temperatureData[timestamp];
    }
}
