"use client";

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { sessionService } from '@/services/sessionService';

export function BookingModal({ open, onClose, therapist, onBook }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Generate time slots from 9am to 5pm (1-hour slots)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push({
        hour,
        time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        displayTime: `${String(hour).padStart(2, '0')}:00`,
      });
    }
    return slots;
  };

  // Fetch available slots for selected date
  useEffect(() => {
    const fetchAvailable = async () => {
      if (!selectedDate || !therapist) return;

      setFetchingSlots(true);
      try {
        // Use userId if available, otherwise try direct ID
        const therapistUserId = therapist?.user?._id || therapist?.userId || therapist?._id;
        const response = await sessionService.getAvailableSlots(therapistUserId, selectedDate);
        const bookedHours = response.data?.bookedHours || [];
        
        const allSlots = generateTimeSlots().map(slot => ({
          ...slot,
          isBooked: bookedHours.includes(slot.hour)
        }));
        setAvailableSlots(allSlots);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
        // If fetch fails, show all slots as available
        setAvailableSlots(generateTimeSlots().map(slot => ({ ...slot, isBooked: false })));
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchAvailable();
  }, [selectedDate, therapist]);

  const handleDateSelect = (daysOffset) => {
    const date = addDays(new Date(), daysOffset);
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const sessionDateTime = setHours(
        setMinutes(selectedDate, 0),
        selectedTime.hour
      );

      // Use userId if available
      const therapistUserId = therapist?.user?._id || therapist?.userId || therapist?._id;

      await onBook({
        therapistId: therapistUserId,
        sessionDate: sessionDateTime.toISOString(),
        durationMinutes: 60,
      });
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  // Generate next 7 days
  const upcomingDays = Array.from({ length: 7 }, (_, i) => ({
    offset: i,
    date: addDays(new Date(), i),
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Book session with ${therapist?.fullName || 'therapist'}`}
      actions={[
        <Button key="cancel" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="book"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || !selectedDate || !selectedTime}
        >
          {loading ? 'Booking...' : 'Confirm booking'}
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Date
          </label>
          <div className="grid grid-cols-4 gap-2">
            {upcomingDays.map(({ offset, date }) => (
              <button
                key={offset}
                onClick={() => handleDateSelect(offset)}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div>{format(date, 'EEE')}</div>
                <div>{format(date, 'MMM d')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Select Time (1-hour session)
            </label>
            {fetchingSlots ? (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 dark:text-gray-400">Loading available slots...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.hour}
                    onClick={() => !slot.isBooked && handleTimeSelect(slot)}
                    disabled={slot.isBooked}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      slot.isBooked
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 line-through cursor-not-allowed opacity-60'
                        : selectedTime?.hour === slot.hour
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400 py-4 text-center">
                No available slots for this date. Please select another date.
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="text-sm text-slate-700">
              <strong>Booking Summary:</strong>
              <br />
              {therapist?.fullName} on {format(selectedDate, 'EEEE, MMMM d, yyyy')} at{' '}
              {selectedTime.time}
              <br />
              Duration: 1 hour
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
