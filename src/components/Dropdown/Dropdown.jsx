"use client";
import { classNames } from "primereact/utils";
import { Tree } from "primereact/tree";

export const Dropdown = (props) => {
  const { nodes } = props;
  const nodeTemplate = (node, options) => {
    let label = <p>{node.label}</p>;

    if (node.url) {
      label = (
        <a
          href={node.url}
          className="text-primary hover:underline font-semibold"
        >
          {node.label}
        </a>
      );
    }

    return <span className={options.className}>{label}</span>;
  };
  const togglerTemplate = (node, options) => {
    if (!node) {
      return;
    }

    const expanded = options.expanded;
    const iconClassName = classNames("p-tree-toggler-icon pi pi-fw", {
      "pi-caret-right": !expanded,
      "pi-caret-down": expanded,
    });

    return (
      <button
        type="button"
        className="p-tree-toggler p-link"
        tabIndex={-1}
        onClick={options.onClick}
      >
        <span className={iconClassName} aria-hidden="true"></span>
      </button>
    );
  };

  return (
    <div>
      <Tree
        value={nodes}
        nodeTemplate={nodeTemplate}
        togglerTemplate={togglerTemplate}
        className="w-full md:w-30rem"
      />
    </div>
  );
};
