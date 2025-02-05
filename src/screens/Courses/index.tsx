import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Keyboard,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  Platform,
  ActionSheetIOS,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { Background } from "../../components/Background";
import { CursoCard } from "../../components/CursoCard";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { Search } from "../../components/Search";
import { ConfigApplicator } from "../../components/ConfigApplicator";

import IconSearch from "../../assets/icon_search.png";

import { styles } from "./styles";
import API from "../../services/api";
import { Loading } from "../../components/Loading";

export interface Curso {
  id: string;
  nome: string;
  tipo: string;
  ativo: string;
  unidadeCurricular: [];
}

export function Courses() {
  // const para abrir a modal
  const [showModal, setShowModal] = useState(false);
  // const para receber os cursos
  const [courses, setCourses] = useState<Curso[]>([]);
  // const para receber a busca pelo filtro de Cursos
  const [searchTypeCourses, setSearchTypeCourses] = useState<Curso[]>([]);
  // useStates para o Select
  const [typeCourses, setTypeCourses] = useState([]);
  // para guardar o que foi selecionado no select
  const [selectTypeCourses, setSelectTypeCourses] = useState();
  // IOS
  const [selectTypeCoursesIOS, setSelectTypeCoursesIOS] = useState(
    "Selecione um tipo de curso"
  );
  // para receber os cursos conforme a busca
  const [searchCourses, setSearchCourses] = useState<Curso[]>([]);
  // value do Search para ser limpado
  const [valueSearch, setValueSearch] = useState();

  // useState para identificar uma filtragem
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState(false);

  // loading na flatlist
  const [loading, setLoading] = useState(true);

  // pegando todos os curso
  async function getCoursesDidMount() {
    try {
      const response = await API.get("/api/curso");
      setCourses(response.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  // pegando as Enums do tipo curso
  async function getTypesCoursesDidMount() {
    try {
      const response = await API.get("/api/curso/tipocurso");
      setTypeCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // buscando cursos pelo filtro tipo de curso
  async function getSearchTypesCoursesDidMount() {
    try {
      if (Platform.OS === "ios") {
        const response = await API.get(
          "/api/curso/buscacurso/" + selectTypeCoursesIOS
        );
        // deixando a array vazia
        searchTypeCourses.splice(0);
        setSearchTypeCourses(response.data);
      } else {
        const response = await API.get(
          "/api/curso/buscacurso/" + selectTypeCourses
        );
        // deixando a array vazia
        searchTypeCourses.splice(0);
        setSearchTypeCourses(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getSearchCursesDidMount(textValue) {
    try {
      // para que o value nunca seja vazio
      setValueSearch(textValue);

      const response = await API.get("/api/curso/buscapalavra/" + textValue);

      // deixando a array vazia
      searchCourses.splice(0);
      setSearchCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // para fazer a requisição as APIs
  useEffect(() => {
    getCoursesDidMount();
    getTypesCoursesDidMount();
    getSearchTypesCoursesDidMount();
  }, []);

  // função para aplicar o filtro
  function filterAplic() {
    setFilter(true);
    setSearch(false);
    clearSearch();
  }

  // Aplicando a busca e removendo o filtro
  const searchAplic = () => {
    setSearch(true);
    setFilter(false);
  };

  // função que vai chamar todas as coisas que devem ser aplicadas ao clicar no botão
  function onPressFilter() {
    setShowModal(false);
    getSearchTypesCoursesDidMount();
    filterAplic();
  }

  // função para aplicar o search
  const searchReceive = (textValue) => {
    // pegar o valor e colocar no value,
    // para depois poder anular ele em qualquer momento
    setValueSearch(textValue);
    getSearchCursesDidMount(textValue);
  };

  // deixando a texInput de buscar vazio
  const clearSearch = () => {
    setValueSearch(null);
  };

  // valida se está sendo feita uma busca ou um filtro, para colocar no componente de remover
  const validateCloseSearch = () => {
    if (search === true) {
      setSearch(false);
      clearSearch();
    } else {
      setFilter(false);
      clearSearch();
    }
  };

  const isListFromLessonsEmpty = () => {

    return <Text style={styles.emptyListStyle}>Nenhuma curso encontrado!</Text>;
  };


  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <Background>
        <Header title="Cursos" subTitle="Consulte por cursos" />
        <View style={styles.containerSearch}>
          <Search
            placeholder="Buscar Cursos"
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

        {/* // Operador ternário  para aplicar as buscas* */}
        {loading  == true ? (
          <Loading />
        ) : filter == true ? (
          // se filtro for aplicado aparecera essa flatList
          <FlatList
            ListHeaderComponent={
              <ConfigApplicator
                text="Filtro Aplicado"
                functionFilter={isListFromLessonsEmpty()}
              />
            }
            data={searchTypeCourses}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => <CursoCard data={item} />}
            horizontal={false}
            showsVerticalScrollIndicator
            style={styles.list}
            ListEmptyComponent={isListFromLessonsEmpty()}
          />
        ) : // Se buscar estiver sendo feita aparecera essa flatList
          search == true ? (
            <FlatList
              ListHeaderComponent={
                <ConfigApplicator
                  text="Busca Aplicado"
                  functionFilter={validateCloseSearch}
                />
              }
              data={searchCourses}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => <CursoCard data={item} />}
              horizontal={false}
              showsVerticalScrollIndicator
              style={styles.list}
              ListEmptyComponent={isListFromLessonsEmpty()}
            ></FlatList>
          ) : (
            // Flatlist que aparece quando não tem nenhuma busca personalizada feita
            <FlatList
              /*  ListHeaderComponent={} */
              data={courses}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => <CursoCard data={item} />}
              horizontal={false}
              showsVerticalScrollIndicator
              style={styles.list}
              ListEmptyComponent={isListFromLessonsEmpty()}
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
                  <Text style={styles.title}>Filtragem Curso</Text>
                </View>
              </View>
              <View style={styles.containerFilter}>
                {Platform.OS === "ios" ? (
                  <TouchableOpacity
                    onPress={() =>
                      ActionSheetIOS.showActionSheetWithOptions(
                        {
                          title: "Selecione uma opção",
                          options: ["cancelar", "LIMPAR"].concat(typeCourses),
                          cancelButtonIndex: 0,
                          destructiveButtonIndex: 1,
                          userInterfaceStyle: "dark",
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            // cancel action
                          } else if (buttonIndex === 1) {
                            setSelectTypeCoursesIOS(
                              "Selecione um tipo de curso"
                            );
                          } else {
                            setSelectTypeCoursesIOS(
                              typeCourses[buttonIndex - 2]
                            );
                          }
                        }
                      )
                    }
                    style={styles.input}
                  >
                    <Text>{selectTypeCoursesIOS}</Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={selectTypeCourses}
                    style={styles.datePickerANDROID}
                    onValueChange={(itemValue) =>
                      setSelectTypeCourses(itemValue)
                    }
                    mode={"dropdown"}
                  >
                    <Picker.Item
                      key={0}
                      label={"Selecione um tipo de curso"}
                      value={'default'}
                      style={styles.itemDatePicker}
                    />
                    {typeCourses.map((cr) => {
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

              <TouchableOpacity
                style={styles.button}
                onPress={() => onPressFilter()}
              >
                <Text style={styles.txtButton}>Buscar</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        ) : (
          ""
        )}
      </Background>
    </Pressable>
  );
}
