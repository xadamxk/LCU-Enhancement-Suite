import { Mutex } from 'async-mutex';
import { Menu, MenuItem } from 'electron';
import { tray } from './tray';

let menu: Menu = null;

export { menu };

const mutex = new Mutex();
const moduleItems = [];
const appItems = [
  new MenuItem({
    role: 'quit'
  })
];

export function initMenu(): void {
  menu = new Menu();

  moduleItems.forEach((menuItem: MenuItem) => menu.append(menuItem));

  menu.append(
    new MenuItem({
      type: 'separator'
    })
  );

  appItems.forEach((menuItem: MenuItem) => menu.append(menuItem));
}

export async function insertMenuItem(newMenuItem: MenuItem): Promise<void> {
  const release = await mutex.acquire();

  const index = moduleItems.findIndex((oldMenuItem: MenuItem) => oldMenuItem.id === newMenuItem.id);

  if (index >= 0) {
    moduleItems[index] = newMenuItem;
  } else {
    moduleItems.push(newMenuItem);
  }

  initMenu();

  tray.setContextMenu(menu);

  release(); // TODO: why does mutex.release() not correctly release the current lock?
}
