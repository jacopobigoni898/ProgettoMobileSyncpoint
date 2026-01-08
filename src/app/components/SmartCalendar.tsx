import React, { useMemo } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { RequestType } from '../../domain/entities/RequestsType';

// Configurazione Italiano
LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Gen.','Feb.','Mar.','Apr.','Mag.','Giu.','Lug.','Ago.','Set.','Ott.','Nov.','Dic.'],
  dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
  dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
  today: 'Oggi'
};
LocaleConfig.defaultLocale = 'it';

// giorni festivi fissi (formato YYYY-MM-DD)
const HOLIDAYS = [
  '2025-01-01', // Capodanno
  '2025-01-06', // Epifania (Aggiunta per testare Gennaio)
  '2025-04-25', // Liberazione
  '2025-05-01', // Lavoro
  '2025-08-15', // Ferragosto
  '2025-12-25', // Natale
];

interface SmartCalendarProps {
  requestType: RequestType;
  startDate: string | null;
  endDate: string | null;
  onRangeSelect: (start: string, end: string | null) => void;
}

export const SmartCalendar = ({ requestType, startDate, endDate, onRangeSelect }: SmartCalendarProps) => {

  // --- HELPER 1: Ottiene il giorno della settimana in modo SICURO ---
  // Aggiungendo 'T12:00:00', evitiamo che il fuso orario sposti la data indietro
  const getSafeDayOfWeek = (dateString: string) => {
    const d = new Date(dateString + 'T12:00:00');
    return d.getDay();
  };

  // --- HELPER 2: Genera array di date tra start e end ---
  const getDatesInRange = (start: string, end: string) => {
    const dates = [];
    let curr = new Date(start + 'T12:00:00');
    const last = new Date(end + 'T12:00:00');

    while (curr <= last) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // --- LOGICA DI SELEZIONE ---
  const handleDayPress = (day: DateData) => {
    const selectedDate = day.dateString;
    const dow = getSafeDayOfWeek(selectedDate); // 0=Dom, 6=Sab

    // 1. Validazione PRIMO CLICK (Singolo Giorno)
    if (requestType === RequestType.HOLIDAY) {
      if (dow === 0 || dow === 6) {
        alert("Non puoi selezionare venerdì o sabato per le ferie!");
        return;
      }
      if (HOLIDAYS.includes(selectedDate)) {
        alert("Non puoi iniziare le ferie in un giorno festivo!");
        return;
      }
    }

    // 2. GESTIONE RANGE
    if (!startDate || (startDate && endDate)) {
      // Nuovo Inizio
      onRangeSelect(selectedDate, null); 
    
    } else if (startDate && !endDate) {
      // Secondo Click (Chiusura Range)
      
      let start = startDate;
      let end = selectedDate;
      
      // Ordiniamo le date se l'utente ha cliccato al contrario
      if (selectedDate < startDate) {
        start = selectedDate;
        end = startDate;
      }

      // --- VALIDAZIONE DELL'INTERO PERIODO (Il pezzo che mancava!) ---
      if (requestType === RequestType.HOLIDAY) {
        const rangeDates = getDatesInRange(start, end);

        // Controllo A: Ci sono festivi in mezzo?
        const hasHoliday = rangeDates.some(d => HOLIDAYS.includes(d));
        if (hasHoliday) {
          alert("L'intervallo selezionato include giorni festivi. Seleziona periodi separati.");
          onRangeSelect(selectedDate, null); // Reset e riparti da questa data
          return;
        }

        // Controllo B: Ci sono Venerdì o Sabati in mezzo?
        const hasWeekend = rangeDates.some(d => {
          const wDow = getSafeDayOfWeek(d);
          return wDow === 0 || wDow === 6;
        });

        if (hasWeekend) {
          alert("L'intervallo include venerdì o sabato (giorni non lavorativi).");
          onRangeSelect(selectedDate, null);
          return;
        }
      }
      // -------------------------------------------------------------

      // Se tutto ok, confermiamo
      onRangeSelect(start, end);
    }
  };

  // --- CALCOLO DEI COLORI ---
  const markedDates = useMemo(() => {
    const marks: any = {};
    const colors = {
      main: '#F59F28',
      selectionText: 'white',
      rangeBg: '#FFE0B2',
      blockedBg: '#FF0000',
      blockedText: '#ffffffff',
      disabledText: '#BDBDBD'
    };

    if (requestType === RequestType.HOLIDAY || requestType === RequestType.SICK_LEAVE) {
      // Festivi Specifici
      HOLIDAYS.forEach(h => {
        marks[h] = {
          disabled: true, disableTouchEvent: true,
          color: colors.blockedBg, textColor: colors.blockedText,
          startingDay: true, endingDay: true
        };
      });

      // Weekend (Loop sicuro)
      const year = new Date().getFullYear();
      let d = new Date(`${year}-01-01T12:00:00`); // Partiamo a mezzogiorno
      
      while (d.getFullYear() === year) {
        const dow = d.getDay();
        if (dow === 0 || dow === 6) {
          const str = d.toISOString().split('T')[0];
          if (!marks[str]) {
            marks[str] = {
              color: colors.blockedBg, textColor: colors.blockedText,
              startingDay: true, endingDay: true
            };
          }
        }
        d.setDate(d.getDate() + 1);
      }
    } else {
        // Non-Ferie
        HOLIDAYS.forEach(h => {
            marks[h] = { marked: true, dotColor: colors.main, textColor: colors.disabledText };
        });
    }

    // Selezione Utente
    if (startDate) {
      marks[startDate] = { 
        startingDay: true, color: colors.main, textColor: colors.selectionText, 
        endingDay: !endDate 
      };

      if (endDate) {
        let curr = new Date(startDate + 'T12:00:00');
        const last = new Date(endDate + 'T12:00:00');
        
        while (curr < last) {
          curr.setDate(curr.getDate() + 1);
          const str = curr.toISOString().split('T')[0];
          
          if (str === endDate) {
            marks[str] = { endingDay: true, color: colors.main, textColor: colors.selectionText };
          } else {
            marks[str] = { color: colors.rangeBg, textColor: 'black' };
          }
        }
      } 
    }

    return marks;
  }, [requestType, startDate, endDate]);

  return (
    <Calendar
      onDayPress={handleDayPress}
      markingType={'period'}
      markedDates={markedDates}
      theme={{
        arrowColor: '#F59F28',
        todayTextColor: '#F59F28',
        textDayHeaderFontWeight: 'bold',
        textDisabledColor: '#E0E0E0', 
      }}
    />
  );
};