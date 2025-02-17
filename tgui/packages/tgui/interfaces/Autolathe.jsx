import { filter, sortBy } from 'common/collections';
import { flow } from 'common/fp';
import { createSearch, toTitleCase } from 'common/string';

import { useBackend, useSharedState } from '../backend';
import { Box, Button, Dropdown, Flex, Input, Section } from '../components';
import { Window } from '../layouts';
import { Materials } from './ExosuitFabricator';

const canBeMade = (recipe, materials, mult = 1) => {
  if (recipe.requirements === null) {
    return true;
  }

  let recipeRequiredMaterials = Object.keys(recipe.requirements);

  for (let mat_id of recipeRequiredMaterials) {
    let material = materials.find((val) => val.name === mat_id);
    if (!material) {
      continue; // yes, if we cannot find the material, we just ignore it :V
    }
    if (material.amount < recipe.requirements[mat_id] * mult) {
      return false;
    }
  }

  return true;
};

export const Autolathe = (props) => {
  const { act, data } = useBackend();
  const { recipes, busy, materials, categories } = data;

  const [category, setCategory] = useSharedState('category', 0);
  const [searchText, setSearchText] = useSharedState('search_text', '');

  const testSearch = createSearch(searchText, (recipe) => recipe.name);

  const recipesToShow = flow([
    filter((recipe) => recipe.category === categories[category]),
    searchText && filter(testSearch),
    sortBy((recipe) => recipe.name.toLowerCase()),
  ])(recipes);

  return (
    <Window width={550} height={700}>
      <Window.Content scrollable>
        <Section title="Materials">
          <Materials disableEject />
        </Section>
        <Section
          title="Recipes"
          buttons={
            <Dropdown
              width="190px"
              options={categories}
              selected={categories[category]}
              onSelected={(val) => setCategory(categories.indexOf(val))}
            />
          }
        >
          <Input
            fluid
            placeholder="Search for..."
            onInput={(e, v) => setSearchText(v)}
            mb={1}
          />
          {recipesToShow.map((recipe) => (
            <Flex justify="space-between" align="center" key={recipe.ref}>
              <Flex.Item>
                <Button
                  color={(recipe.hidden && 'red') || null}
                  icon="hammer"
                  iconSpin={busy === recipe.name}
                  disabled={!canBeMade(recipe, materials, 1)}
                  onClick={() => act('make', { make: recipe.ref })}
                >
                  {toTitleCase(recipe.name)}
                </Button>
                {(!recipe.is_stack && (
                  <Box as="span">
                    <Button
                      color={(recipe.hidden && 'red') || null}
                      disabled={!canBeMade(recipe, materials, 5)}
                      onClick={() =>
                        act('make', { make: recipe.ref, multiplier: 5 })
                      }
                    >
                      x5
                    </Button>
                    <Button
                      color={(recipe.hidden && 'red') || null}
                      disabled={!canBeMade(recipe, materials, 10)}
                      onClick={() =>
                        act('make', { make: recipe.ref, multiplier: 10 })
                      }
                    >
                      x10
                    </Button>
                  </Box>
                )) ||
                  null}
              </Flex.Item>
              <Flex.Item>
                {(recipe.requirements &&
                  Object.keys(recipe.requirements)
                    .map(
                      (mat) =>
                        toTitleCase(mat) + ': ' + recipe.requirements[mat],
                    )
                    .join(', ')) || <Box>No resources required.</Box>}
              </Flex.Item>
            </Flex>
          ))}
        </Section>
      </Window.Content>
    </Window>
  );
};
