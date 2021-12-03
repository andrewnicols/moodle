export default class Mutations {
    getItemByName(state, name) {
        for (const item of state.items) {
            if (item.name === name) {
                return item;
            }
        }
        return null;
    }

    /**
     * The favourite mutation.
     *
     * @param {StateManager} stateManager
     * @param {string} itemName
     * @param {boolean} wasFavourite
     */
    toggleFavourite(stateManager, itemName, wasFavourite) {
        // TODO Use WS.
        stateManager.setReadOnly(false);
        stateManager.state.items.get(itemName).favourite = !wasFavourite;
        stateManager.setReadOnly(true);
    }

    setTabVisibilities(stateManager) {
        const results = Array.from(stateManager.state.tabData).map(([, tabConfig]) => {
            if (!tabConfig.visibleFunction && tabConfig.visible) {
                return false;
            }

            let tabItems = Array.from(stateManager.state.items.values());
            if (tabConfig.filterFunction) {
                tabItems = tabItems.filter(tabConfig.filterFunction);
            }

            const visible = tabConfig.visibleFunction({items: tabItems});

            if (visible === tabConfig.visible) {
                return false;
            }

            return {
                name: 'tabData',
                action: 'update',
                fields: {
                    ...tabConfig,
                    visible,
                },
            };
        }).filter(value => value);

        if (results.length) {
            stateManager.processUpdates(results);
        }
    }

    selectTab(stateManager, itemName) {
        const results = [];

        Array.from(stateManager.state.tabData).forEach(([tabName, tabData]) => {
            if (tabName === itemName && !tabData.isActive) {
                const newTabData = {
                    ...tabData,
                    isActive: true,
                };
                results.push({
                    name: 'tabData',
                    action: 'update',
                    fields: newTabData,
                });

                results.push(...this.setItemVisibilities(stateManager, newTabData));
            } else if (tabData.isActive) {
                results.push({
                    name: 'tabData',
                    action: 'update',
                    fields: {
                        ...tabData,
                        isActive: false,
                    },
                });
            }
        });

        if (results.length) {
            stateManager.processUpdates(results);
        }
    }

    setItemVisibilities(stateManager, tabConfig) {
        const results = Array.from(stateManager.state.items).map(([, item]) => {
            let visible = true;
            if (tabConfig.filterFunction) {
                visible = tabConfig.filterFunction(item);
            }

            if (visible === item.visible) {
                return false;
            }

            return {
                name: 'items',
                action: 'update',
                fields: {
                    ...item,
                    visible,
                },
            };
        }).filter(value => value);

        return results;
    }
}
