import React from "react";

const BreadcrumbSection = ({ breadcrumbs, viewAllLink }) => {
    return (
        <div className="shadow-md rounded-lg mx-auto mb-8 breccc flex justify-center items-center text-white">
            <div className="breadcrumb bg-white rounded-lg px-4 py-2 flex items-center text-xs text-gray-600 justify-center">
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                        <span className="mr-2">
                            <a
                                href={breadcrumb.link}
                                className={`hover:underline ${
                                    breadcrumb.isActive
                                        ? "text-blue-600"
                                        : "text-gray-600"
                                }`}
                            >
                                {breadcrumb.text}
                            </a>
                        </span>
                        {index < breadcrumbs.length - 1 && (
                            <span className="mx-2">&gt;</span>
                        )}
                    </React.Fragment>
                ))}
                <span className="ml-auto">
                    <a
                        href={viewAllLink.link}
                        className="text-blue-600 hover:underline font-bold px-8 py-4"
                    >
                        {viewAllLink.text}
                    </a>
                </span>
            </div>
        </div>
    );
};

export default BreadcrumbSection;
