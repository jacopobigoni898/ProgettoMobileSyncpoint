import React from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { RequestType } from '../../domain/entities/RequestsType';

// Configurazione Italiano (Se l'hai già in un altro file config, importala, altrimenti lasciala qui)
LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Gen.','Feb.','Mar.','Apr.','Mag.','Giu.','Lug.','Ago.','Set.','Ott.','Nov.','Dic.'],
  dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
  dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
  today: 'Oggi'
};
LocaleConfig.defaultLocale = 'it';

// MOCK DEI FESTIVI (In futuro arriveranno dal backend)
const HOLIDAYS = [
  '2025-01-01', // Capodanno
  '2025-04-25', // Liberazione
  '2025-05-01', // Lavoro
  '2025-08-15', // Ferragosto
  '2025-12-25', // Natale
];

interface SmartCalendarProps {
  requestType: RequestType;      // Il calendario cambia faccia in base a questo!
  startDate: string | null;
  endDate: string | null;
  onRangeSelect: (start: string, end: string | null) => void;
}

export const SmartCalendar = ({ requestType, startDate, endDate, onRangeSelect }: SmartCalendarProps) => {

  // Logica di selezione (quella che avevamo prima)
  const handleDayPress = (day: DateData) => {
    const dow = new Date(day.dateString).getDay(); // 5 = Fri, 6 = Sat

    // Non consentire venerdì o sabato per le FERIE
    if (requestType === RequestType.HOLIDAY && (dow === 5 || dow === 6)) {
      alert("Non puoi prendere ferie il venerdì o il sabato!");
      return;
    }

    // Se clicco su un festivo E sto chiedendo FERIE, blocco il click (opzionale, o mostro alert)
    if (requestType === RequestType.HOLIDAY && HOLIDAYS.includes(day.dateString)) {
      alert("Non puoi iniziare le ferie in un giorno festivo!");
      return;
    }

    if (!startDate || (startDate && endDate)) {
      onRangeSelect(day.dateString, null);
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        onRangeSelect(day.dateString, null);
      } else {
        onRangeSelect(startDate, day.dateString);
      }
    }
  };

  // --- CUORE DEL COMPONENTE: CALCOLO DEI COLORI ---
  const getMarkedDates = () => {
    const marks: any = {};
    const mainColor = '#F59F28';
    const holidayColor = '#FF0000';

    // Festivi: disabilitati e rossi se FERIE, altrimenti soft
    if (requestType === RequestType.HOLIDAY) {
      HOLIDAYS.forEach(h => {
        marks[h] = {
          disabled: true,
          disableTouchEvent: true,
          color: '#ffffffff',
          textColor: holidayColor,
          marked: true,
          dotColor: holidayColor
        };
      });
    } else {
      HOLIDAYS.forEach(h => {
        marks[h] = {
          color: '#FFFDF5',
          textColor: '#BDBDBD',
          marked: false
        };
      });
    }

    // Evidenzia (e blocca) tutti i Venerdì e Sabato del corrente anno se FERIE
    if (requestType === RequestType.HOLIDAY) {
      const year = new Date().getFullYear();
      for (let d = new Date(year, 0, 1); d <= new Date(year, 11, 31); d.setDate(d.getDate() + 1)) {
        const dow = d.getDay(); // 5 = Fri, 6 = Sat
        if (dow === 5 || dow === 6) {
          const str = d.toISOString().split('T')[0];
          // Non sovrascrive selezioni utente (quelle verranno applicate dopo)
          marks[str] = {
            disabled: true,
            disableTouchEvent: true,
            color: '#FFEBEE',
            textColor: holidayColor,
            marked: true,
            dotColor: holidayColor
          };
        }
      }
    }

    // Selezione utente (sovrascrive le marcature sopra)
    if (startDate) {
      marks[startDate] = { startingDay: true, color: mainColor, textColor: 'white' };

      if (endDate) {
        let curr = new Date(startDate);
        const end = new Date(endDate);
        while (curr < end) {
          curr.setDate(curr.getDate() + 1);
          const str = curr.toISOString().split('T')[0];

          if (str === endDate) {
            marks[str] = { endingDay: true, color: mainColor, textColor: 'white' };
          } else {
            marks[str] = { color: '#FFE0B2', textColor: 'black' };
          }
        }
      } else {
        marks[startDate] = { selected: true, color: mainColor, textColor: 'white', endingDay: true, startingDay: true };
      }
    }

    return marks;
  };



  return (
    <Calendar
      onDayPress={handleDayPress}
      markingType={'period'}
      markedDates={getMarkedDates()}
      theme={{
        arrowColor: '#F59F28',
        todayTextColor: '#F59F28',
        textDayHeaderFontWeight: 'bold'
      }}
    />
  );
};