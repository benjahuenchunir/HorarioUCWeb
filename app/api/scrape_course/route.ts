import Scraper from '@/lib/scraper/scraper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { courseId } = await request.json();
    console.log(courseId);

    if (typeof courseId !== 'string') {
        return NextResponse.json({error: 'Invalid courseId'}, {status: 400});
    }

    const scraper = new Scraper();
    const courseInfo = await scraper.findCourseInfo(courseId);
    console.log("--------------------------------------")
    console.log(courseInfo);
    console.log("--------------------------------------")
    return NextResponse.json({data: courseInfo}, {status: 200});
}