import 'dayjs/locale/pt-br'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'

dayjs.locale('pt-br')
dayjs.extend(relativeTime)

type AttendeeType = {
  id: string
  name: string
  email:  string
  createdAt: string
  checkInAt: string | null
}

export function AttendeeList(){
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if(url.searchParams.has('search')){
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if(url.searchParams.has('page')){
      return Number(url.searchParams.get('page'))
    }

    return 1
 
  })

  const [total, setTotal] = useState(0)
  const [attendees, setAteendees] = useState<AttendeeType[]>([])

  const totalPages = Math.ceil(total / 10)

  function setCurrentSearch(search:string){
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)
    window.history.pushState({}, "", url)

    setSearch(search)
  }

  function setCurrentPage(page: number){
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))
    window.history.pushState({}, "", url)

    setPage(page)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>){
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToNextpage(){
    setCurrentPage(page + 1)
  }

  function goToPreviousPage(){
    setCurrentPage(page - 1)
  }

  function goToFirstPage(){
    setCurrentPage(1)
  }

  function goToLastPage(){
    setCurrentPage(totalPages)
  }

  useEffect(() => {
    const url = new URL(`https://pass-in-server.onrender.com/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees`)
    url.searchParams.set('pageIndex', String(page - 1))
    
    if(search.length > 0){
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAteendees(data.attendees)
        setTotal(data.total)
      }
    )
  }, [page, search])

  return (
    <main className="flex flex-col gap-4">
      <section className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className='flex items-center gap-3 px-3 w-72 py-1.5 border border-white/10 rounded-lg' >
          <Search className='size-4 text-emerald-300' />
          <input 
            onChange={onSearchInputChange}
            value={search}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" 
            placeholder="Buscar participante..." 
          />
        </div>
      </section>
      <Table>
        <thead className=' border-b border-white/10'>
          <tr className=''>
            <TableHeader style={{ width: 48 }}>
              <input                 
                type="checkbox"
                className='size-4 bg-black/20 rounded border border-white/10 text-orange-500 cursor-pointer' 
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {
            attendees.map((attendee) => {
              return (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10 text-orange-500 cursor-pointer' />
                  </TableCell>
                  <TableCell>{attendee.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">{attendee.name}</span>
                      <span className="text-zinc-300">{attendee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                  <TableCell>
                    {
                      attendee.checkInAt === null 
                        ? <span className="text-zinc-400">Não fez check-in</span>
                        : dayjs().to(attendee.checkInAt)
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton transparent >
                      <MoreHorizontal className='size-4' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </tbody>
        <tfoot>
          <TableCell colSpan={3}>
            Mostrando {attendees.length} de {total} items
          </TableCell>
          <TableCell className='text-right' colSpan={3}>
            <div className="inline-flex items-center gap-8">
              <span className="">Página {page} de {totalPages}</span>

              <div className="flex gap-1.5">
                <IconButton onClick={goToFirstPage} disabled={page === 1}>
                  <ChevronsLeft className='size-4' />
                </IconButton>
                <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                  <ChevronLeft className='size-4' />
                </IconButton>
                <IconButton onClick={goToNextpage} disabled={page === totalPages}>
                  <ChevronRight className='size-4' />
                </IconButton>
                <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                  <ChevronsRight className='size-4' />
                </IconButton>
              </div>
            </div>
          </TableCell>
        </tfoot>
      </Table>    
    </main>
  )
}
