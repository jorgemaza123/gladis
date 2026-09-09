import { isAdmin } from '@/lib/auth';
import { readSite } from '@/repositories/site';
import { Admin, Login } from '@/components/admin';
export const metadata={title:'Administración de contenido',robots:{index:false,follow:false}};
export default async function AdminPage(){return await isAdmin()?<Admin initial={await readSite()}/>:<Login/>;}
