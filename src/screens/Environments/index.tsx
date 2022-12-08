import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "../../assets/icon_curso.png";

import { AmbienteCard } from "../../components/AmbienteCard";
import { Background } from "../../components/Background";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { Search } from "../../components/Search";

import { styles } from "./styles";

import API from "../../services/api";
import { ConfigApplicator } from "../../components/ConfigApplicator";
import { Loading } from "../../components/Loading";

export interface Ambientes {
  id: string;
  nome: string;
  capacidade: string;
  tipo: string;
  cep: string;
  complemento: string;
  ativo: boolean;
}

export function Environments({ id, ...rest }: Ambientes) {
  const [showModal, setShowModal] = useState(false);
  const [ambientes, setAmbientes] = useState<Ambientes[]>([]);
  const [typeSearchAmbiente, setTypeSearchAmbiente] = useState<Ambientes[]>([]);
  const [capacitySearchAmbiente, setCapacitySearchAmbiente] = useState<
    Ambientes[]
  >([]);
  const [environmentTypeAndCapacity, setEnvironmentTypeAndCapacity] = useState<
    Ambientes[]
  >([]);
  const [typeAmbiente, setTypeAmbiente] = useState([]);
  const [selectTypeAmbient, setSelectTypeAmbient] = useState();
  const [capacidadeAmbient] = useState([
    "Selecione a capacidade do Ambiente",
    "10-15",
    "20-25",
    "25-30",
    "30+",
  ]);
  const [capacidadeAmbientIOS] = useState(["10-15", "20-25", "25-30", "30+"]);
  const [selectCapacidadeAmbient, setSelectCapacidadeAmbient] = useState([]);
  const [filter, setFilter] = useState(false);
  const [checkOnPressFilter, setCheckOnPressFilter] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchEnvironment, setSearchEnvironment] = useState<Ambientes[]>([]);
  const [valueSearch, setValueSearch] = useState();
  const [selectTypeEnviromentsIOS, setSelectTypeEnviromentsIOS] = useState(
    "Selecione um tipo de ambiente"
  );
  const [selectCapacityIOS, setSelectCapacityIOS] = useState(
    "Selecione a capacidade do ambiente"
  );

  // APIs
  // buscar todos os ambiente
  async function getAmbientesDidMount() {
    try {
      const response = await API.get("/api/ambiente");
      setAmbientes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // trazer todos os tipos de ambiente para alimentar o picker
  async function getTypeAmbientesDidMount() {
    try {
      const response = await API.get("/api/ambiente/tipoambiente");
      setTypeAmbiente(response.data);
    } catch (error) {
      console.log(`Erro ao trazer tipo de ambiente: ${error}`);
    }
  }

  // filtro para buscar ambientes pela a tipo de ambiente selecionada no picker
  async function getFilterTypeEnvironmentsDidMount() {
    try {
      const response = await API.get(
        "/api/ambiente/buscaambiente/" + selectTypeAmbient
      );

      typeSearchAmbiente.splice(0);
      setTypeSearchAmbiente(response.data);
    } catch (error) {
      console.log(`Erro ao trazer Filtragem por tipo de ambiente: ${error}`);
    }
  }

  // filtro para buscar ambientes pela a capacidade selecionada no picker
  const getFilterCapacityDidMountANDROID = async () => {
    let capacityPositionInitial = [capacidadeAmbient[0]];
    let capacityPositionFinal = [capacidadeAmbient[4]];

    if (selectCapacidadeAmbient == capacityPositionInitial) {
      console.log("filtro não selecionado ");
    } else if (selectCapacidadeAmbient == capacityPositionFinal) {
      console.log(
        "filtro +30 " + " posição 1 :" + selectCapacidadeAmbient.slice(0, 2)
      );
      const response = await API.get(
        `/api/ambiente/capacidade?capacidadeMin=${selectCapacidadeAmbient.slice(
          0,
          2
        )}&capacidadeMax=${100}`
      );
      setCapacitySearchAmbiente(response.data);
    } else {
      const response = await API.get(
        `/api/ambiente/capacidade?capacidadeMin=${selectCapacidadeAmbient.slice(
          0,
          2
        )}&capacidadeMax=${selectCapacidadeAmbient.slice(3)}`
      );
      setCapacitySearchAmbiente(response.data);
    }
  };

  // filtro para buscar ambientes pela a capacidade selecionada no IOS
  const getFilterCapacityDidMountIOS = async () => {
    if (selectCapacityIOS == "Selecione a capacidade do ambiente") {
      console.log("filtro não selecionado ");
    } else if (selectCapacityIOS == "30+") {
      console.log(
        "filtro +30 " + " posição 1 :" + selectCapacityIOS.slice(0, 2)
      );
      const response = await API.get(
        `/api/ambiente/capacidade?capacidadeMin=${selectCapacityIOS.slice(
          0,
          2
        )}&capacidadeMax=${100}`
      );
      setCapacitySearchAmbiente(response.data);
    } else {
      const response = await API.get(
        `/api/ambiente/capacidade?capacidadeMin=${selectCapacidadeAmbient.slice(
          0,
          2
        )}&capacidadeMax=${selectCapacidadeAmbient.slice(3)}`
      );
      setCapacitySearchAmbiente(response.data);
    }
  };

  // busca por palavra chave, TextInput
  async function getSearchEnvironmentsDidMount(textValue) {
    try {
      // para que o value nunca seja vazio
      setValueSearch(textValue);

      const response = await API.get("/api/ambiente/buscapalavra/" + textValue);

      searchEnvironment.splice(0);
      setSearchEnvironment(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // para o picker, busca ambiente pela tipo e capacidade
  async function getTypeAndCapacityDidMount() {
    try {
      const response = await API.get(
        `/api/ambiente/tipoecapacidade?tipo=${selectTypeAmbient}&capacidadeMin=${selectCapacidadeAmbient.slice(
          0,
          2
        )}&capacidadeMax=${selectCapacidadeAmbient.slice(3)}`
      );
      setEnvironmentTypeAndCapacity(response.data);
    } catch (error) {
      console.log(
        `Erro ao fazer requisição de filtragem por Tipo e Capacidade ${error}`
      );
    }
  }

  // requisição APIs e métodos iniciais
  useEffect(() => {
    getAmbientesDidMount();
    getTypeAmbientesDidMount();
    getFilterTypeEnvironmentsDidMount();
    validateOnPressFilter();
  }, []);

  // Validate Button Filter
  useEffect(() => {
    validateOnPressFilter();
  }, [selectCapacidadeAmbient, selectTypeAmbient]);

  // aplicar filtro
  function filterAplic() {
    setFilter(true);
    setSearch(false);
    clearSearch();
  }

  const searchAplic = () => {
    setSearch(true);
    setFilter(false);
  };

  const searchReceive = (textValue) => {
    setValueSearch(textValue);
    getSearchEnvironmentsDidMount(textValue);
  };

  const clearSearch = () => {
    setValueSearch(null);
  };

  // valida se está sendo feita uma busca ou um filtro
  const validateCloseSearch = () => {
    if (search === true) {
      setSearch(false);
      clearSearch();
    } else {
      setFilter(false);
      clearSearch();
    }
  };

  // Button Filter
  const validateOnPressFilter = () => {
    let capacityPositionInitial = [capacidadeAmbient[0]];

    if (
      selectTypeAmbient != "default" ||
      selectCapacidadeAmbient != capacityPositionInitial
    ) {
      setCheckOnPressFilter(true);
    } else {
      setCheckOnPressFilter(false);
    }
  };

  function onPressFilter() {
    setShowModal(false);
    filterAplic();
    getFilterTypeEnvironmentsDidMount();
    getFilterCapacityDidMountANDROID();
    getTypeAndCapacityDidMount();
  }

  const getFilters = () => {
    let capacityPositionInitial = [capacidadeAmbient[0]];

    if (
      selectTypeAmbient != "default" &&
      selectCapacidadeAmbient != capacityPositionInitial
    ) {
      return environmentTypeAndCapacity;
    } else if (selectTypeAmbient != "default") {
      return typeSearchAmbiente;
    } else if (selectCapacidadeAmbient != capacityPositionInitial) {
      return capacitySearchAmbiente;
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <Background>
        <Header title="Ambientes" subTitle="Consulte os ambientes" />
        <View style={styles.containerSearch}>
          <Search
            placeholder="Buscar ambientes"
            aplicSearch={searchAplic}
            receiveSearch={searchReceive}
            clenSearch={valueSearch}
          />
          <TouchableOpacity
            style={
              Platform.OS === "ios"
                ? styles.btnModalIOS
                : styles.btnModalANDROID
            }
            onPress={() => setShowModal(true)}
          >
            <Filter />
          </TouchableOpacity>
        </View>
        {ambientes.length == 0 ? (
          <Loading />
        ) : filter == true ? (
          <FlatList
            ListHeaderComponent={
              <ConfigApplicator
                text="Filtro Aplicado"
                functionFilter={validateCloseSearch}
              />
            }
            data={getFilters()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AmbienteCard data={item} />}
            horizontal={false}
            showsVerticalScrollIndicator
            style={styles.list}
          ></FlatList>
        ) : search == true ? (
          <FlatList
            ListHeaderComponent={
              <ConfigApplicator
                text="Busca Aplicada"
                functionFilter={validateCloseSearch}
              />
            }
            data={searchEnvironment}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AmbienteCard data={item} />}
            horizontal={false}
            showsVerticalScrollIndicator
            style={styles.list}
          ></FlatList>
        ) : (
          <FlatList
            data={ambientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AmbienteCard data={item} />}
            horizontal={false}
            showsVerticalScrollIndicator
            style={styles.list}
          ></FlatList>
        )}
        {showModal == true ? (
          <Pressable
            style={styles.background}
            onPress={() => setShowModal(false)}
          >
            <Pressable style={styles.modal} onPress={() => setShowModal(true)}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.txtClose}>X</Text>
                </TouchableOpacity>
                <View style={styles.vwTitle}>
                  <Text style={styles.title}>Filtragem Ambiente</Text>
                </View>
              </View>
              <View style={styles.containerFilter}>
                <View style={styles.contentFilter}>
                  {Platform.OS == "ios" ? (
                    <TouchableOpacity
                      onPress={() =>
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            title: "Selecione uma opção",
                            options: ["cancelar", "LIMPAR"].concat(
                              typeAmbiente
                            ),
                            cancelButtonIndex: 0,
                            destructiveButtonIndex: 1,
                            userInterfaceStyle: "dark",
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              // cancel action
                            } else if (buttonIndex === 1) {
                              setSelectTypeEnviromentsIOS(
                                "Selecione um tipo de ambiente"
                              );
                            } else {
                              setSelectTypeEnviromentsIOS(
                                typeAmbiente[buttonIndex - 2]
                              );
                            }
                          }
                        )
                      }
                      style={styles.input}
                    >
                      <Text>{selectTypeEnviromentsIOS}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={selectTypeAmbient}
                      style={styles.datePickerANDROID}
                      mode={"dropdown"}
                      onValueChange={(itemValue) =>
                        setSelectTypeAmbient(itemValue)
                      }
                    >
                      <Picker.Item
                        key={0}
                        label="Selecione um tipo de Ambiente"
                        value={"default"}
                        color="#00000090"
                      />
                      {typeAmbiente.map((cr) => {
                        return (
                          <Picker.Item
                            key={cr}
                            label={cr}
                            value={cr}
                            style={styles.itemDatePicker}
                          />
                        );
                      })}
                    </Picker>
                  )}
                </View>
                <View style={styles.contentFilter}>
                  {Platform.OS == "ios" ? (
                    <TouchableOpacity
                      onPress={() =>
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            title: "Selecione uma opção",
                            options: ["cancelar", "LIMPAR"].concat(
                              capacidadeAmbientIOS
                            ),
                            cancelButtonIndex: 0,
                            destructiveButtonIndex: 1,
                            userInterfaceStyle: "dark",
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              // cancel action
                            } else if (buttonIndex === 1) {
                              setSelectCapacityIOS(
                                "Selecione a capacidade do ambiente"
                              );
                            } else {
                              setSelectCapacityIOS(
                                capacidadeAmbientIOS[buttonIndex - 2]
                              );
                            }
                          }
                        )
                      }
                      style={styles.input}
                    >
                      <Text>{selectCapacityIOS}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={selectCapacidadeAmbient}
                      style={styles.datePickerANDROID}
                      mode={"dropdown"}
                      onValueChange={(itemValue) =>
                        setSelectCapacidadeAmbient(itemValue)
                      }
                    >
                      {capacidadeAmbient.map((cr) => {
                        return (
                          <Picker.Item
                            key={cr}
                            label={cr}
                            value={cr}
                            style={styles.itemDatePicker}
                          />
                        );
                      })}
                    </Picker>
                  )}
                </View>
              </View>

              {/* Validate Button Filter */}
              {checkOnPressFilter == false ? (
                <TouchableOpacity
                  style={styles.buttonDisabled}
                >
                  <Text style={styles.txtButton}>Buscar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => onPressFilter()}
                >
                  <Text style={styles.txtButton}>Buscar</Text>
                </TouchableOpacity>
              )}
            </Pressable>
          </Pressable>
        ) : (
          ""
        )}
      </Background>
    </Pressable>
  );
}
