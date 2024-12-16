import './App.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { InputSwitchChangeEvent } from 'primereact/inputswitch';
        

interface ListDataProp{
  title:string
  place_of_origin:string
  artist_display:string
  inscriptions:string
  date_start:number
  date_end:number
}
function App() {

  const [listData, setListData] = useState<ListDataProp[] | undefined>(undefined)
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  // const [rowClick, setRowClick] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<ListDataProp[] | null>(null);


  const onPageChange = (event: PaginatorPageChangeEvent) => {
      setFirst(event.first);
      setRows(event.rows);
  };

  useEffect(()=>{
    const getData= async()=>{
     const res= await fetch('https://api.artic.edu/api/v1/artworks?page=1')
     
     const gu = await res.json()
     console.log(gu)
    //  const {data} = await res.json()

    //  setListData(data)
    }
    getData()
  },[])

  console.log(listData)
  return (
    <>
    
       <DataTable value={listData} selectionMode={'checkbox'} selection={selectedProducts!}
                        onSelectionChange={(e:any) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field='title' header="Title" className='title'></Column>
          <Column field="place_of_origin" header="Place of origin"></Column>
          <Column field="artist_display" header="Artist display"></Column>
          <Column field="inscriptions" header="Inscriptions"></Column>
          <Column field="date_start" header="Date start"></Column>
          <Column field="date_end" header="Date end"></Column>
      </DataTable>
      <Paginator rows={12} totalRecords={10528} onPageChange={onPageChange} />
    </>
  )
}

export default App
