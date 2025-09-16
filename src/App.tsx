import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Stopwatch state (continuous incrementing timer)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  
  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycles, setCycles] = useState(0)
  
  const stopwatchIntervalRef = useRef<number | null>(null)
  const pomodoroIntervalRef = useRef<number | null>(null)

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Format time in HH:MM:SS format for stopwatch
  const formatStopwatchTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // Show notification
  const showNotification = (title: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/vite.svg'
      })
    }
  }

  // Stopwatch effects
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1)
      }, 1000)
    } else {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current)
      }
    }

    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current)
      }
    }
  }, [stopwatchRunning])

  // Pomodoro effects
  useEffect(() => {
    if (pomodoroRunning) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            // Timer finished
            setPomodoroRunning(false)
            
            if (isBreak) {
              // Break finished, start work session
              setIsBreak(false)
              setPomodoroTime(25 * 60)
              showNotification('Break Complete!', 'Ready to focus? Let\'s get back to work! 💪')
            } else {
              // Work session finished, start break
              setIsBreak(true)
              setPomodoroTime(5 * 60)
              setCycles(prev => prev + 1)
              showNotification('Pomodoro Complete!', 'Great job! Time for a well-deserved break! 🎉')
            }
            
            return prev - 1
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current)
      }
    }
  }, [pomodoroRunning, isBreak])

  // Initialize notification permission on component mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Stopwatch controls
  const startStopwatch = () => setStopwatchRunning(true)
  const stopStopwatch = () => setStopwatchRunning(false)
  const resetStopwatch = () => {
    setStopwatchRunning(false)
    setStopwatchTime(0)
  }

  // Pomodoro controls
  const startPomodoro = () => setPomodoroRunning(true)
  const stopPomodoro = () => setPomodoroRunning(false)
  const resetPomodoro = () => {
    setPomodoroRunning(false)
    setIsBreak(false)
    setPomodoroTime(25 * 60)
    setCycles(0)
  }

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-stone-800 mb-12">
          🍅 Pomodoro Timer
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Stopwatch Section */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-stone-700 mb-2">
                ⏱️ Stopwatch
              </h2>
              <div className="text-3xl font-mono text-stone-600 mb-4">
                {formatStopwatchTime(stopwatchTime)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={startStopwatch}
                disabled={stopwatchRunning}
                className="px-3 py-1.5 bg-stone-800 text-white rounded-md text-sm hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-stone-200"
              >
                Start
              </button>
              <button
                onClick={stopStopwatch}
                disabled={!stopwatchRunning}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md text-sm hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-stone-200"
              >
                Pause
              </button>
              <button
                onClick={resetStopwatch}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md text-sm hover:bg-stone-200 transition-all border border-stone-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Pomodoro Section */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-stone-700 mb-1">
                🎯 Focus Session
              </h2>
              <p className="text-sm text-stone-500 mb-3">
                {isBreak ? 'Time for a break' : 'Stay focused'}
              </p>
              <div className="text-3xl font-mono text-stone-700 mb-2">
                {formatTime(pomodoroTime)}
              </div>
              <div className="text-xs text-stone-400">
                {cycles} cycles completed
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={startPomodoro}
                disabled={pomodoroRunning}
                className="px-3 py-1.5 bg-stone-800 text-white rounded-md text-sm hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Start
              </button>
              <button
                onClick={stopPomodoro}
                disabled={!pomodoroRunning}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md text-sm hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-stone-200"
              >
                Pause
              </button>
              <button
                onClick={resetPomodoro}
                className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md text-sm hover:bg-stone-200 transition-all border border-stone-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-stone-100/50 border border-stone-200 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-6 text-sm text-stone-600">
              <div>
                <h4 className="font-medium text-stone-700 mb-2">📊 Stopwatch</h4>
                <p className="text-stone-500">Track total study time continuously</p>
              </div>
              <div>
                <h4 className="font-medium text-stone-700 mb-2">⏰ Pomodoro</h4>
                <p className="text-stone-500">25min focus + 5min break cycles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
