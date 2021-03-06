import React, { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { MdClose } from 'react-icons/md'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'
import Dropzone from '../../components/Dropzone'

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import api from '../../services/api'

function TeacherForm() {
    const history = useHistory()

    const [selectedFile, setSelectedFile] = useState<File>()

    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [bio, setBio] = useState('')

    const [subject, setSubject] = useState('')
    const [cost, setCost] = useState('')

    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '', to: '' }
    ])

    function handleAddNewScheduleItem() {
        setScheduleItems([
            ...scheduleItems,
            { week_day: 0, from: '', to: '' }
        ])
    }

    function handleDeleteNewSchedule(item: any) {
        const filteredSchedule = scheduleItems.filter(scheduleItem => {
            return scheduleItem != item
        })
        setScheduleItems(filteredSchedule)
        console.log(scheduleItems)
    }

    function setScheduleItemValue(position: number, field: string, value: string) {
        const tmp_schedulesItems = scheduleItems.map((scheduleItem, index) => {
            if (index === position) {
                return { ...scheduleItem, [field]: value }
            }
            return scheduleItem
        })
        setScheduleItems(tmp_schedulesItems)
    }

    function handleCreateUser(e: FormEvent) {
        e.preventDefault() // Previne o comportamento padrão de um form (reload)

        const data = new FormData()

        data.append('name', name)
        data.append('whatsapp', whatsapp)
        data.append('bio', bio)
        data.append('subject', subject)
        data.append('cost', cost)
        data.append('schedule', JSON.stringify(scheduleItems))

        if (selectedFile) {
            data.append('avatar', selectedFile)
        } else {
            alert('Ooops! Por favor insira uma imagem do Ponto de Coleta')
            return;
        }

        api.post('/classes', data).then(() => {
            alert('Cadastro realizado com sucesso!')
            history.push('/')
        })
    }

    return (
        <div id="page-teacher-form" className="container">
            <PageHeader
                title="Que incrível que você quer dar aulas!"
                description="O primeiro passo é preencher este formulário de inscrição"
            />

            <main>
                <form onSubmit={handleCreateUser}>
                    <fieldset>
                        <legend>Seus dados</legend>
                        <Dropzone onFileUploaded={setSelectedFile} />
                        <Input
                            name="name"
                            label="Nome completo"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                        {/* <Input
                            name="avatar"
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => { setAvatar(e.target.value) }}
                        /> */}
                        <Input
                            name="whatsapp"
                            label="Whatsapp"
                            value={whatsapp}
                            onChange={(e) => { setWhatsapp(e.target.value) }}
                        />
                        <Textarea
                            name="bio"
                            label="Biografia"
                            value={bio}
                            onChange={(e) => { setBio(e.target.value) }}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <Select
                            name="subject"
                            label="Matéria"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value) }}
                            options={[
                                { value: 'Artes', label: 'Artes' },
                                { value: 'Ciências', label: 'Ciências' },
                                { value: 'Matemática', label: 'Matemática' },
                                { value: 'Biologia', label: 'Biologia' },
                                { value: 'Geografia', label: 'Geografia' },
                                { value: 'História', label: 'História' },
                                { value: 'Português', label: 'Português' },
                                { value: 'Química', label: 'Química' },
                                { value: 'Física', label: 'Física' }
                            ]}
                        />
                        <Input
                            name="cost"
                            label="Custo da Hora/Aula"
                            value={cost}
                            onChange={(e) => { setCost(e.target.value) }}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>
                            Horários Disponíveis
                        <button onClick={handleAddNewScheduleItem} type="button">
                                + Novo Horário
                        </button>
                        </legend>
                        {scheduleItems.map((scheduleItem, index) => {
                            return (
                                <div key={index} className="schedule-item">
                                    <Select
                                        name="week_day"
                                        label="Dia da semana"
                                        value={scheduleItem.week_day}
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        options={[
                                            { value: '0', label: 'Domingo' },
                                            { value: '1', label: 'Segunda-Feira' },
                                            { value: '2', label: 'Terça-Feira' },
                                            { value: '3', label: 'Quarta-Feira' },
                                            { value: '4', label: 'Quinta-Feira' },
                                            { value: '5', label: 'Sexta-Feira' },
                                            { value: '6', label: 'Sábado' }
                                        ]}
                                    />
                                    <Input
                                        name="from"
                                        label="Das"
                                        type="time"
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    <Input
                                        name="to"
                                        label="Até"
                                        type="time"
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />
                                    <button onClick={() => handleDeleteNewSchedule(scheduleItem)} type="button" ><MdClose /></button>
                                </div>
                            )
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante" />
                        Importante! <br />
                        Preencha todos os dados
                    </p>
                        <button type="submit">
                            Salvar cadastro
                    </button>
                    </footer>
                </form>
            </main>
        </div>
    )
}

export default TeacherForm