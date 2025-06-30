declare module 'gray-matter' {
    function matter(input: string): { data: any; content: string };
    export = matter;
}
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}