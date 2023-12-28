import React from 'react';
import { GroupedSection, Section } from '@/types/model';

export function SectionInfoList ({ groupedSections } : { groupedSections: GroupedSection[] }) {
    if (!groupedSections) {
        return null;
    }

    return (
        <div className="p-4 border rounded shadow max-h-96 overflow-auto">
            <div className="grid grid-cols-4 gap-4 border-b-2 py-2">
                <h2 className="text-xl font-bold">Sigla</h2>
                <h3 className="text-lg font-semibold">Secciones</h3>
                <h3 className="text-lg font-semibold">NRCs</h3>
                <h3 className="text-lg font-semibold">Profesores</h3>
            </div>
            {groupedSections.map((group, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 border-b-2 py-2">
                    <div className="flex flex-col justify-center">
                        <p>{group.sigla}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                        {group.sections.map((section: Section, index: number) => (
                            <p key={index}>{section.seccion}</p>
                        ))}
                    </div>
                    <div className="flex flex-col justify-center">
                        {group.sections.map((section: Section, index: number) => (
                            <p key={index}>{section.nrc}</p>
                        ))}
                    </div>
                    <div className="flex flex-col justify-center">
                        {group.sections.map((section: Section, index: number) => (
                            <p key={index}>{section.profesor}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};