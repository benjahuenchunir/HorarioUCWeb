

export default async function Index() {

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
                            <div className="px-5 py-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox"/>
                                    <span className="ml-2 text-white">Option 1</span>
                                </label>
                            </div>
                            <div className="px-5 py-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-white">Guardados</h3>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        +
                                    </button>
                                </div>
                                <ul className="mt-3 text-white">
                                    <li>File 1</li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                <button
                    className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
                    aria-label="Open sidebar">
                </button>
            </div>
            <main className="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
                <div className="py-6">
                    <div className="px-4 sm:px-6 md:px-8">
                        <div className="py-5">
                            <div className="flex">
                                <input type="text" className="form-input flex-grow mr-3" placeholder="Course code"/>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">Agregar</button>
                            </div>
                        </div>
                        <div className="py-5">
                            <ul>
                                <li>Course 1</li>
                            </ul>
                        </div>
                        <div className="py-5">
                            <table className="table-fixed">
                                <thead>
                                    <tr>
                                        <th className="w-1/5">Mon</th>
                                        <th className="w-1/5">Tue</th>
                                        <th className="w-1/5">Wed</th>
                                        <th className="w-1/5">Thu</th>
                                        <th className="w-1/5">Fri</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>8:00</td>
                                        <td>9:00</td>
                                        <td>10:00</td>
                                        <td>11:00</td>
                                        <td>12:00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="py-5">
                            <ul>
                                <li>Current Course 1</li>
                            </ul>
                        </div>
                        <div className="py-5">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded">Buscar OFGs</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}
