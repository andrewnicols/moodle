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

    setTabVisibilities(stateManager, reactive) {
        const results = Array.from(stateManager.state.tabData).map(([, tabConfig]) => {
            const visibilityFunction = reactive.getTabVisibilityFunction(tabConfig.name);
            if (!visibilityFunction && tabConfig.visible) {
                return false;
            }

            const filterFunction = reactive.getTabFilterFunction(tabConfig.name);
            let tabItems = Array.from(stateManager.state.items.values());
            if (filterFunction) {
                tabItems = tabItems.filter(filterFunction);
            }

            const visible = visibilityFunction({items: tabItems});
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

    selectTab(stateManager, reactive, itemName) {
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

                results.push(...this.setItemVisibilities(stateManager, reactive, newTabData));
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

    setItemVisibilities(stateManager, reactive, tabConfig) {
        const results = Array.from(stateManager.state.items).map(([, item]) => {
            let visible = true;
            const filterFunction = reactive.getTabFilterFunction(tabConfig.name);
            if (filterFunction) {
                visible = filterFunction(item);
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
