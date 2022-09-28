import React, { useState, useEffect } from 'react'
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
} from 'react-native';

import { Background } from '../../components/Background';
import { CursoCard } from '../../components/CursoCard';
import { Filter } from '../../components/Filter';
import { Header } from '../../components/Header';
import { Search } from '../../components/Search';


import { CURSOS } from '../../utils/cursos';


import IconSearch from '../../assets/icon_search.png'


import { styles } from './styles';
import API from '../../services/api';

export interface Curso{
  id: string
  nome: string
  tipoCurso: string
  ativo: string
  unidadeCurricular: []
}

export function Courses() {


  const [showModal, setShowModal] = useState(false)
  const [cursos, setCursos] = useState<Curso[]>([])

  async function getCursosDidMount() {
    const response = await API.get('/api/curso')

    setCursos(response.data)
    
  }

  useEffect(() => {
    getCursosDidMount()
  },[])

  
  return (
    <Pressable
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <Background>
        <Header title='Cursos' subTitle='Consulte por cursos' />
        <View style={styles.containerSearch}>
          <Search placeholder='Buscar Cursos' />
          <TouchableOpacity style={styles.btnModal} onPress={() => setShowModal(true)}>
            <Filter />
          </TouchableOpacity>
        </View>
        <FlatList
          data={cursos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CursoCard
              data={item}
            />
          )}
          horizontal={false}
          showsVerticalScrollIndicator
          style={styles.list}
        >

        </FlatList>
        {
          showModal == true ?
            <View style={styles.background}>
              <View style={styles.modal}>
                <View style={styles.vwTitle}>
                  <Text style={styles.title} >Filtragem  Curso</Text>
                </View>
                <View style={styles.containerFilter}>
                  <TextInput style={styles.input} placeholder='TIPO DE CURSO' />
                  <TouchableOpacity style={styles.containerImg}>
                    <Image
                      source={IconSearch}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
                  <Text style={styles.txtButton}>Buscar</Text>
                </TouchableOpacity>
              </View>
            </View>
            : ''
        }
      </Background>
    </Pressable>
  );
}

