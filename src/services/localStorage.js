class LocalStorageService {
  prefix = 'thread';

  setItem(name, data) {
    const dataToSave = typeof data !== 'object' ? data : JSON.stringify(data);
    localStorage.setItem(`${this.prefix}-${name}`, dataToSave);
  }

  getItem(name) {
    const val = localStorage.getItem(`${this.prefix}-${name}`);
    if (val) {
      return val.indexOf('{') !== 0 ? val : JSON.parse(val);
    }
    return '';
  }

  removeItem(name) {
    const itemToRemove = name.indexOf(this.prefix) === 0 ? name : `${this.prefix}-${name}`;
    localStorage.removeItem(itemToRemove);
  }

  removeAll() {
    // TODO: need to refactor when we can get clientId from server
    const clientId = this.getItem('clientId');
    localStorage.clear();
    this.setItem('clientId', clientId);
  }
}

export default new LocalStorageService();
