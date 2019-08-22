

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View,Alert} from 'react-native';


export default class App extends Component {
  
  constructor(props)
  {
      super(props);

    this.state={
      data:'',
    };

  }

  componentDidMount()
  {
    let request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
    
      if (request.status === 200) {//http OK mesajı
        
        let XMLParser = require('react-xml-parser');
        let xml = new XMLParser().parseFromString(request.responseText);// text'i xml,json tarzına çeviriyor
       
        this.setState({data:xml.getElementsByTagName('Currency')});//currency taglarını çekiyorum
       
      } else {
        Alert.alert('Uyarı','İnternet Bağlantınızı Kontrol ediniz.');
      }
    };
    
    request.open('GET', 'https://www.tcmb.gov.tr/kurlar/today.xml',true);
    request.send();
     
}
render_item({item})
{
  return(
    <View style={styles.column_view_style} >
    <View style={{flex:1}}>
    <Text style={styles.row_text_style}>{item.attributes.Kod}</Text>
    </View>
    <View style={{flex:1}}>
    <Text style={styles.row_text_style}>{item.children[1].value}</Text>
    
    </View>
    <View style={{flex:1}}>
    <Text style={styles.row_text_style}>{item.children[3].value}</Text>
    
    </View>
    <View style={{flex:1}}>
    
    <Text style={styles.row_text_style}>{item.children[4].value}</Text>
    </View>
    </View>
    
  );
}
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.column_view_style}>
        <View style={{flex:1}}>
        <Text style={styles.column_text_style}>{'Kod'}</Text>
        </View>
        <View style={{flex:1}}>
        <Text style={styles.column_text_style}>{'İsim'}</Text>
        
        </View>
        <View style={{flex:1}}>
        <Text style={styles.column_text_style}>{'Alış'}</Text>
        
        </View>
        <View style={{flex:1}}>
        
        <Text style={styles.column_text_style}>{'Satış'}</Text>
        </View>
        </View>
        <View style={{flex:9}}>
        <FlatList 
         data={this.state.data}
         extraData={this.state}
         renderItem={this.render_item}
         keyExtractor={(item)=>item.attributes.Kod}></FlatList>
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
  },
  column_view_style:{
   flex:1,
   flexDirection:'row',
    
  },
  column_text_style:{
  textAlign:'center',
  textAlignVertical:'center',
   color:'black',
   width:'100%',
   height:'100%',
   fontSize:20
  },
  row_text_style:{
    textAlign:'center',
    textAlignVertical:'center',
     color:'black',
     width:'100%',
     height:'100%',
    }
});
