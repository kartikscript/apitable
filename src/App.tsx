import './App.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
        

interface ListDataProp{
  id:number
  title:string
  place_of_origin:string
  artist_display:string
  inscriptions:string
  date_start:number
  date_end:number
}
function App() {

  const op = useRef<OverlayPanel | null>(null)
  const [listData, setListData] = useState<ListDataProp[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [first, setFirst] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<ListDataProp[] | undefined>(undefined);


  const onPageChange = (event: PaginatorPageChangeEvent) => {
      getData(event.page+1)
      setFirst(event.first);
  };

  const fetchAPI = async(page:number)=>{
    try {
      const res= await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      const {data}:{data:ListDataProp[]} = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  }


  const getData= async(pageNumber:number)=>{
    setIsLoading(true)
    try {
      const data = await fetchAPI(pageNumber)
      setListData(data)
      
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSelectedProducts=async (rowsNum:string)=>{

    const divisor  =  12
    const dividend = Number(rowsNum)
    const quotient = Math.floor(dividend/divisor)
    const remainder = dividend % divisor

    try {
      const promises = [];
    
      for (let i = 1; i <= quotient; i++) {
        promises.push(fetchAPI(i));
      }
      const resData = await Promise.all(promises);
      const refinedData = resData.flat()
      console.log(refinedData)
      if(remainder){
        const nextPageData =await fetchAPI(quotient+1) 
        const remainingArrData = nextPageData?.slice(0,remainder)
        const combinedData = refinedData.concat(remainingArrData)
        //@ts-ignore
        setSelectedProducts(combinedData)
      }else{
        //@ts-ignore
      setSelectedProducts(refinedData)
      }
    } catch (error) {
      console.log(error)
    }
    
  }
  useEffect(()=>{
    getData(1)
  },[])

  return (
    <>
    
       <DataTable size='small' loading={isLoading} value={listData}  selectionMode={'multiple'} selection={selectedProducts!}
                       onSelectionChange={(e:any) => setSelectedProducts(e.value)} tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field='title'
           header={
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <OverlayPanel ref={op} >
                    <input style={{display:'block',marginBottom:"8px",fontSize:'large'}} value={inputValue} onChange={e=>setInputValue(e.target.value)} type='number' placeholder='Select rows' />
                    <button style={{backgroundColor:"whitesmoke"}} onClick={()=>handleSelectedProducts(inputValue)}>Submit</button>
                </OverlayPanel>
                <Button type="button" style={{ fontSize: '4px',backgroundColor:'transparent' }} onClick={(e) => op.current?.toggle(e)} >
                 <img src='/arrow-down.png' alt='down arrow' width={20}/>
                </Button>
                <p>Title</p>
            </div>
           } 
          
          ></Column>
          <Column field="place_of_origin" header="Place of origin"></Column>
          <Column field="artist_display" header="Artist display"></Column>
          <Column field="inscriptions" header="Inscriptions"></Column>
          <Column field="date_start" header="Date start"></Column>
          <Column field="date_end" header="Date end"></Column>
      </DataTable>
      <Paginator first={first} rows={listData?.length} totalRecords={10528}  onPageChange={onPageChange} />
    </>
  )
}

export default App
