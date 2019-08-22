
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,SafeAreaView,CheckBox,Modal,Alert} from 'react-native';
import Database from './src/database/database';

let db,interval_instance;
export default class App extends Component {
  
  constructor(props)
  {
   super(props);
   this.state={
     say:10,
      checked_text_color:[[false,'A','transparent',''],[false,'B','transparent',''],[false,'C','transparent',''],[false,'D','transparent','']],
      dogru_cevap:'C',
      modal_visible:false,
      data:[],//sorular ve soruların cevaplarını,o sorunun doğru cevabını bu diziye atıyoruz.
      soru_sayac:0,
      soru:'',
  };
  db=new Database();
  db.get_data().then((data)=>{  

    this.setState({data:data});
    this.next_soru();
  });

  }

next_soru()
{
  
if(this.state.soru_sayac!=this.state.data.length)//kaçın cı soruya gelmişiz ona bakıyoruz.
{
let liste=this.state.checked_text_color;//matrisi listeye atıyoruz.

for(let i=0;i<liste.length;i++)
{
  liste[i][0]=false;//bütün cevapaların checked'ını false yapıyoruz.
  liste[i][2]='transparent';//default renk
  liste[i][3]='';//Doğru/yanlış textleri siliniyor
}
//database'den çektiğimiz soruları liste atıyoruz.
let soru_index=this.state.soru_sayac;
liste[0][1]=this.state.data[soru_index].a;
liste[1][1]=this.state.data[soru_index].b;
liste[2][1]=this.state.data[soru_index].c;
liste[3][1]=this.state.data[soru_index].d;

//yeni soru ile ilgili verileri state'de güncelliyoruz
this.setState({checked_text_color:liste,soru:this.state.data[soru_index].soru,dogru_cevap:this.state.data[soru_index].cevap,say:10,modal_visible:false,soru_sayac:(this.state.soru_sayac+1)});

this.sayac_baslat();
}
else
{
  //soru bittiyse sayacı durduruyoruz.
  clearInterval(interval_instance);
  Alert.alert('Uyarı','Soru Bitti baba',[

{text:'Tekrar Başla',onPress:()=>{this.setState({soru_sayac:0,say:10});this.next_soru();} },
  ],{cancelable:true})
}


  }
 
  boya()
  {
    
    clearInterval(interval_instance);
    this.setState({modal_visible:true});//modal'ın görünmesini sağlıyoruz'ki kullanıcı bu anda ekrana müdahale edemiyoruz. 
    setTimeout(()=>{

      for(let i=0;i<this.state.checked_text_color.length;i++)
      {
          if(this.state.checked_text_color[i][0]===true)//seçilen checkbox'u matriste'ki yerini buluyoruz.
          {
            if(this.state.checked_text_color[i][1]==this.state.dogru_cevap)
            {
              //Eğer doğruysa 
               this.array_values_changed('blue',i,2);//secilen bölge mavi
               this.array_values_changed('DOĞRU',i,3); //ve doğru texti
               
            }
            else
            {
              //Eğer yanlış ise
              this.array_values_changed('red',i,2);//secilen bölge kırmızı
              this.array_values_changed('YANLIŞ',i,3); // ve yanlış texti
              
            }
            setTimeout(()=>{ this.next_soru()},2000);//2 saniye sonra yeni soruya geciliyor.
            break;
          }
      }
    },1000);
    
  }
  sayac_baslat()
  {
    
    interval_instance=setInterval(() => {
      
      if(this.state.say==0)//eğer bir şey seçilmemizse
      {
        clearInterval(interval_instance);//sayacı durduyoruz
        this.setState({modal_visible:true});//modal'ın görünmesini sağlıyoruz'ki kullanıcı bu anda ekrana müdahale edemiyoruz. 
        for(let i=0;i<this.state.checked_text_color.length;i++)
      {
            if(this.state.checked_text_color[i][1]==this.state.dogru_cevap)//cevapları karşılaştırarak doğru text'in matristeki index'ini buluyoruz
            {
              this.array_values_changed(true,i,0);//matristeki yerini true olarak güncelliyoruz
              this.boya();
              break; 
            }
            
      }
      } 
      else
      {
        
         this.setState({say:(this.state.say-1)});
      }


    },1000);
  }
  
  array_values_changed(value,satir,sutun)
  {
    //state'deki matris güncelleniyor
   let array=this.state.checked_text_color;
   array[satir][sutun]=value;
   this.setState({checked_text_color:array});
  }

  render() {
    return (
      <SafeAreaView style={styles.main_view_style}>
      <Modal animationType='slide' transparent={true} visible={this.state.modal_visible}></Modal>
        <View style={styles.sayac_view_style}>
        <Text style={styles.sayac_text_style}>{this.state.say}</Text>
        </View>
        <View style={styles.soru_view_style}>
        <Text style={{height:'100%',textAlign:'center',textAlignVertical:'center',color:'black'}}>{this.state.soru}</Text>
        </View>
         
        <View style={styles.cevap_view_style}>
        
        <View style={{flex:1,borderBottomWidth:1}}>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,justifyContent:'flex-start',flexDirection:'row'}}><CheckBox  style={{height:'100%'}} onValueChange={()=>{this.array_values_changed(true,0,0);this.boya();}} value={this.state.checked_text_color[0][0]}></CheckBox><Text style={styles.cevap}>{this.state.checked_text_color[0][1]}</Text></View>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0}}><Text style={{height:'100%',textAlign:'center',textAlignVertical:'center',color:'white',backgroundColor:this.state.checked_text_color[0][2],fontSize:18}}>{this.state.checked_text_color[0][3]}</Text></View>

        </View>

        <View style={{flex:1,borderBottomWidth:1}}>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,justifyContent:'flex-start',flexDirection:'row'}}><CheckBox  style={{height:'100%'}} onValueChange={()=>{this.array_values_changed(true,1,0);this.boya();}} value={this.state.checked_text_color[1][0]}></CheckBox><Text style={styles.cevap}>{this.state.checked_text_color[1][1]}</Text></View>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0}}><Text style={{height:'100%',textAlign:'center',textAlignVertical:'center',color:'white',backgroundColor:this.state.checked_text_color[1][2],fontSize:18}}>{this.state.checked_text_color[1][3]}</Text></View>

        </View>
        
        <View style={{flex:1,borderBottomWidth:1}}>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,justifyContent:'flex-start',flexDirection:'row'}}><CheckBox  style={{height:'100%'}} onValueChange={()=>{this.array_values_changed(true,2,0);this.boya();}} value={this.state.checked_text_color[2][0]}></CheckBox><Text style={styles.cevap}>{this.state.checked_text_color[2][1]}</Text></View>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0}}><Text style={{height:'100%',textAlign:'center',textAlignVertical:'center',color:'white',backgroundColor:this.state.checked_text_color[2][2],fontSize:18}}>{this.state.checked_text_color[2][3]}</Text></View>

        </View>

        <View style={{flex:1,borderBottomWidth:1}}>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,justifyContent:'flex-start',flexDirection:'row'}}><CheckBox  style={{height:'100%'}} onValueChange={()=>{this.array_values_changed(true,3,0);this.boya();}} value={this.state.checked_text_color[3][0]}></CheckBox><Text style={styles.cevap}>{this.state.checked_text_color[3][1]}</Text></View>
        <View style={{position:'absolute',left:0,top:0,right:0,bottom:0}}><Text style={{height:'100%',textAlign:'center',textAlignVertical:'center',color:'white',backgroundColor:this.state.checked_text_color[3][2],fontSize:18}}>{this.state.checked_text_color[3][3]}</Text></View>

        </View>
        
   
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main_view_style:{

    flex:1,
    flexDirection:'column'

  },
  sayac_view_style:{
    flex:1,
     borderBottomWidth:1,

  },
  soru_view_style:{
    flex:3,
    borderBottomWidth:1

  },
  cevap_view_style:{
    flex:5,
    flexDirection:'column',
   
  },
  sayac_text_style:{
    fontSize:25,
    color:'black',
    textAlignVertical:'center',
    textAlign:'center',
    height:'100%',
  },
  cevap:{
    height:'100%',
    textAlignVertical:'center',
    color:'black',
  }
});
