export interface ContentItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: 'VIDEO' | 'PDF' | 'HTML';
  fileUrl: string;
  createdAt?: string;
}