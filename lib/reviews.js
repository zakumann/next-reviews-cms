import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function getFeaturedReview(){
    const reviews = await getReviews();
    return reviews[0]
}

// content/reviews 파일에 있는 마크다운 파일을 웹과 연동시킬 때 쓰인 코드
export async function getReview(slug){
    const text = await readFile(`./content/reviews/${slug}.md`, 'utf8');
    const { content, data: { title, date, image } } = matter(text);
    const body = marked(content);
    return { slug, title, date, image, body };
}
// 마크다운을 웹에 표현할 때 쓰인 코드
export async function getReviews(){
    const slugs = await getSlugs();
    const reviews = [];
    for (const slug of slugs) {
        const review = await getReview(slug);
        reviews.push(review);
    }
    reviews.sort((a, b) => b.date.localeCompare(a.date));
    return reviews;
}

export async function getSlugs(){
    const files = await readdir('./content/reviews');
    return files.filter((file) => file.endsWith('.md'))
        .map((file) => file.slice(0, -'.md'.length));
}