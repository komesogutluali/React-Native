import SQLite from 'react-native-sqlite-storage';

 class Database{

constructor()
{
   
    this.createtable();    
}
createtable()
{

    return new Promise((resolve,reject)=>{
        this.baglan();
        this.baglanti.transaction((tx) => {
            tx.executeSql("select name FROM sqlite_master WHERE type=? AND name=?", ['table','Sorular'],(tx,results)=>{
          if(results.rows.item(0)===undefined)
           {     
              tx.executeSql('CREATE TABLE Sorular (id INTEGER PRIMARY KEY autoincrement NOT NULL,soru text not null,a text not null,b text not null,c text not null,d text not null,cevap text not null)', []);   
               tx.executeSql('insert into Sorular(soru,a,b,c,d,cevap) values(?,?,?,?,?,?)',["Cevdet Bey Ve Oğulları Eseri Kime Aittir?","Orhan Pamuk","Yahya Kemal Bayatlı","Atilla İlhan","Samipaşazade Sezai","Orhan Pamuk"]);
               tx.executeSql('insert into Sorular(soru,a,b,c,d,cevap) values(?,?,?,?,?,?)',["Aspirinin Hammaddesi Nedir?","Meşe ","Köknar","Kavak","Söğüt","Söğüt"]);
               tx.executeSql('insert into Sorular(soru,a,b,c,d,cevap) values(?,?,?,?,?,?)',["Hub ile ilgili olarak aşağıdakilerden hangisi yanlıştır?","Tekrarlayıcı görevi görür ","Büyük ağı 'alt ağlara' bölerek ağ performansını arttırır.","Gelen sinyalleri olduğu gibi verir, içeriğe bakmaz.","Verilerin gerekliliğini kontrol etmez.","Büyük ağı 'alt ağlara' bölerek ağ performansını arttırır."]);
 
           }
    });    
        });
        this.kapat();
    });
}
success()
{

}
error(err)
{

}
baglan()
{
this.baglanti=SQLite.openDatabase({name: 'soru.db', location: 'default'},this.success,this.error);       
}
kapat()
{
    return new Promise((resolve,reject)=>{
        this.baglanti=null;
       });    
}
insert(values)
{
   return new Promise((resolve,reject)=>{
    this.baglan();
    this.baglanti.transaction((tx) => {
        tx.executeSql('',values);   
      });
   this.kapat();

   });    
}
update(values)
{

    this.baglan();
        this.baglanti.transaction((tx) => {
            tx.executeSql('',values);
            
          });
       this.kapat(); 

}
delete(values)
{
 return new Promise((resolve,reject)=> 
 {
     this.baglan();
    this.baglanti.transaction((tx) => {
        tx.executeSql('',values);
      });
   this.kapat(); 
});

}
get_data()
{
    return new Promise((resolve)=>{

        this.baglan();
        this.baglanti.transaction((tx) => {
            tx.executeSql('select soru,a,b,c,d,cevap from  Sorular', [], (tx, results) => {
                         
              let array=[];
              for(let i=0;i<results.rows.length;i++)
              {
                array[i]={soru:results.rows.item(i).soru,a:results.rows.item(i).a,b:results.rows.item(i).b,c:results.rows.item(i).c,d:results.rows.item(i).d,cevap:results.rows.item(i).cevap};
              }
              this.kapat();
            resolve(array);                            
          });
        });
      
    });
}

}
export default Database;